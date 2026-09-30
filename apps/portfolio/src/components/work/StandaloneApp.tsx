import Image from "next/image";
import styles from "@/app/work/work.module.scss";

interface StandaloneAppProps {
  slug: string;
  title: string;
  summary: string;
  images: { src: string; alt: string }[];
  link?: string;
  reverse?: boolean;
}

export function StandaloneApp({ slug, title, summary, images, link, reverse }: StandaloneAppProps) {
  return (
    <div className={`${styles.standalone} ${reverse ? styles.reverse : ""}`}>
      {images.length > 0 && (
        <div className={styles.standaloneShots}>
          {images.map((image, index) => (
            <div className={styles.standaloneShot} key={index}>
              <Image src={image.src} alt={image.alt || title} width={180} height={320} style={{ height: "280px", width: "auto" }} />
            </div>
          ))}
        </div>
      )}
      <div className={styles.standaloneBody}>
        <span className={styles.standaloneStatus}>
          <span className={`${styles.statusDot} ${link ? styles.live : ""}`} />
          {link ? "Live on Play Store" : "Shipped"}
        </span>
        <h2 className={styles.standaloneTitle}>{title}</h2>
        <p className={styles.standaloneSummary}>{summary}</p>
        <div className={styles.standaloneLinks}>
          <a className={styles.appLink} href={`/work/${slug}`}>
            Read details →
          </a>
          {link && (
            <a className={styles.appLink} href={link} target="_blank" rel="noopener noreferrer">
              View on store →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
