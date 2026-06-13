import { google } from "googleapis";
import type { SheetRow } from "./types.js";

const SHEET_ID   = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME ?? "Ideas";

// Columns: A=keyword  B=title_hint  C=category  D=status  E=processed_at  F=article_id  G=error
const DATA_RANGE   = `${SHEET_NAME}!A2:G`;
const STATUS_RANGE = (row: number) => `${SHEET_NAME}!D${row}:G${row}`;

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var is missing");
  return new google.auth.GoogleAuth({
    credentials: JSON.parse(raw),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function fetchPendingRows(): Promise<SheetRow[]> {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: DATA_RANGE,
  });

  const rows = res.data.values ?? [];

  return rows
    .map((row, i) => ({
      rowIndex: i + 2, // +1 for 1-index, +1 to skip header
      keyword:   (row[0] ?? "").trim(),
      titleHint: (row[1] ?? "").trim(),
      category:  (row[2] ?? "").trim(),
      status:    (row[3] ?? "pending").trim().toLowerCase(),
    }))
    .filter((r) => r.keyword && r.status === "pending");
}

export async function updateRowStatus(
  rowIndex: number,
  status: "processing" | "processed" | "error",
  articleId?: string,
  errorMsg?: string,
) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: STATUS_RANGE(rowIndex),
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        status,
        new Date().toISOString(),
        articleId ?? "",
        errorMsg  ?? "",
      ]],
    },
  });
}
