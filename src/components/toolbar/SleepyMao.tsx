import styles from '../../styles/toolbar/SleepyMao.module.css'

export default function SleepyMao({ show }: { show: boolean }) {
  return (
    <>
      {show && (
        <div className={styles.zzzContainer}>
          <span className={styles.z}>z</span>
          <span className={styles.z}>z</span>
          <span className={styles.z}>z</span>
        </div>
      )}
    </>
  )
}