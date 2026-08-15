import { Button } from "@/components/ui/primitives";
import { Icon } from "@/icons/icons";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <div className={`container ${styles.wrap}`}>
      <Icon name="eye" size={36} className={styles.icon} />
      <p className={`${styles.code} mono`}>ERROR 404</p>
      <h1 className={styles.title}>Signal lost.</h1>
      <p className={styles.description}>This route doesn't exist in the case file index.</p>
      <Button as="link" to="/" icon="arrow">
        Return to Home
      </Button>
    </div>
  );
}
