import { getPosts } from "@/app/utils/utils";
import { PlatformGroup } from "@/components/work/PlatformGroup";
import { StandaloneApp } from "@/components/work/StandaloneApp";
import styles from "@/app/work/work.module.scss";

export function Projects() {
  const allProjects = getPosts(["src", "app", "work", "projects"]).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );

  const platforms = new Map<string, typeof allProjects>();
  const standalone: typeof allProjects = [];

  for (const project of allProjects) {
    const platform = project.metadata.platform;
    if (platform) {
      const group = platforms.get(platform) ?? [];
      group.push(project);
      platforms.set(platform, group);
    } else {
      standalone.push(project);
    }
  }

  return (
    <>
      {Array.from(platforms.entries()).map(([name, apps]) => (
        <PlatformGroup
          key={name}
          name={name}
          description={apps.find((a) => a.metadata.platformDescription)?.metadata.platformDescription || ""}
          apps={apps.map((a) => ({
            slug: a.slug,
            title: a.metadata.title,
            role: a.metadata.platformRole || "",
            link: a.metadata.link,
            image: a.metadata.images?.[0],
          }))}
        />
      ))}

      <div>
        <p className={styles.standaloneHeading}>Independent apps</p>
        {standalone.map((project, index) => (
          <StandaloneApp
            key={project.slug}
            slug={project.slug}
            title={project.metadata.title}
            summary={project.metadata.summary}
            images={project.metadata.images || []}
            link={project.metadata.link}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </>
  );
}
