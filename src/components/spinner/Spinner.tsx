import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.cube1}></div>
      <div className={styles.cube2}></div>
    </div>
  );
}
