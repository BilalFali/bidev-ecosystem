import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Projects } from "@/components/work/Projects";
import { getPosts } from "@/app/utils/utils";
import styles from "./work.module.scss";

const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--work-font-display" });
const monoFont = JetBrains_Mono({ subsets: ["latin"], variable: "--work-font-mono" });

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  const projects = getPosts(["src", "app", "work", "projects"]);
  const platformCount = new Set(projects.map((p) => p.metadata.platform).filter(Boolean)).size;
  const liveCount = projects.filter((p) => p.metadata.link).length;

  return (
    <div className={`${styles.page} ${displayFont.variable} ${monoFont.variable}`}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`${baseURL}/og?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <div className={styles.intro}>
        <h1 className={styles.introTitle}>Shipped Products</h1>
        <div className={styles.introStats}>
          <span>{projects.length} apps</span>
          <span>{platformCount} platforms</span>
          <span>{liveCount} live on Play Store</span>
        </div>
      </div>

      <Projects />
    </div>
  );
}
