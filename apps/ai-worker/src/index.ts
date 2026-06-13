import "dotenv/config";
import cron from "node-cron";
import { fetchPendingRows, updateRowStatus } from "./sheets.js";
import { generateArticle } from "./generator.js";
import { saveDraft, slugExists } from "./database.js";

const CRON_SCHEDULE = process.env.CRON_SCHEDULE ?? "*/30 * * * *"; // every 30 min
const RUN_ONCE      = process.argv.includes("--once");

async function processIdeas(): Promise<void> {
  const ts = new Date().toISOString();
  console.log(`\n[${ts}] AI worker starting…`);

  let rows;
  try {
    rows = await fetchPendingRows();
  } catch (err) {
    console.error("  Failed to read Google Sheet:", err);
    return;
  }

  if (rows.length === 0) {
    console.log("  No pending ideas found.");
    return;
  }

  console.log(`  Found ${rows.length} pending idea(s).`);

  for (const row of rows) {
    console.log(`\n  → Processing: "${row.keyword}"`);

    // Mark as processing immediately to prevent double-processing on overlap
    try {
      await updateRowStatus(row.rowIndex, "processing");
    } catch (err) {
      console.error("    Could not mark row as processing — skipping:", err);
      continue;
    }

    try {
      const article = await generateArticle(row);
      console.log(`    Generated: "${article.title}" (${article.reading_time} min read)`);

      // Resolve slug collisions
      if (await slugExists(article.slug)) {
        article.slug = `${article.slug}-${Date.now()}`;
        console.log(`    Slug collision — using: ${article.slug}`);
      }

      const articleId = await saveDraft(article);
      await updateRowStatus(row.rowIndex, "processed", articleId);

      console.log(`    Saved draft id: ${articleId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`    Failed: ${msg}`);
      try {
        await updateRowStatus(row.rowIndex, "error", undefined, msg.slice(0, 500));
      } catch {
        // Ignore sheet update failure on error path
      }
    }

    // Brief pause between articles to respect rate limits
    await new Promise<void>((r) => setTimeout(r, 2000));
  }

  console.log("\n  Worker run complete.");
}

if (RUN_ONCE) {
  // npm run run-once — process all pending rows then exit
  processIdeas().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  // Start immediately, then repeat on schedule
  processIdeas();
  cron.schedule(CRON_SCHEDULE, processIdeas);
  console.log(`AI worker scheduled: ${CRON_SCHEDULE}`);
  console.log("Press Ctrl+C to stop.\n");
}
