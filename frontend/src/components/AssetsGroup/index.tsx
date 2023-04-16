import React from "react"
import styles from './AssetsGroup.module.css'

const AssetsGroup = ({ title, children }: { title: string, children: React.ReactNode}) => {
  return (
    <div className={styles.box}>
      <div className={styles.listTitle}>{title}</div>
      <div className={styles.list}>
       {children}
      </div>
    </div>
  )
}

export default AssetsGroup