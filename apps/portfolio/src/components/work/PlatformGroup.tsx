import Image from "next/image";
import styles from "@/app/work/work.module.scss";

interface PlatformApp {
  slug: string;
  title: string;
  role: string;
  link?: string;
  image?: { src: string; alt: string };
}

interface PlatformGroupProps {
  name: string;
  description: string;
  apps: PlatformApp[];
}

export function PlatformGroup({ name, description, apps }: PlatformGroupProps) {
  return (
    <div className={styles.platform}>
      <div className={styles.platformHead}>
        <h2 className={styles.platformName}>{name}</h2>
        <span className={styles.platformCount}>{apps.length} apps</span>
      </div>
      <p className={styles.platformDescription}>{description}</p>
      <div className={styles.platformApps}>
        {apps.map((app) => (
          <div className={styles.appTile} key={app.slug}>
            <span className={styles.appRole}>{app.role}</span>
            <h3 className={styles.appTitle}>{app.title}</h3>
            {app.image && (
              <div className={styles.appShot}>
                <Image
                  src={app.image.src}
                  alt={app.image.alt || app.title}
                  width={320}
                  height={200}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}
            <a className={styles.appLink} href={`/work/${app.slug}`}>
              Read details →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
