import styles from '../../../styles/toolbar/SleepyMao.module.css'

export default function SleepyMao({ show }: { show: boolean }) {
  return (
    <>
      {show && (
        <div className={styles.zzzContainer} aria-hidden="true">
          <span className={styles.z}>z</span>
          <span className={styles.z}>z</span>
          <span className={styles.z}>z</span>
        </div>
      )}
    </>
  )
}