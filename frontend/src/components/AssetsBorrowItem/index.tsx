import Image from 'next/image'
import { StaticImageData } from "next/image"
import styles from './AssetsBorrowItem.module.css'

type Asset = {
  name: string
  src: StaticImageData
  balance: number
  apr: string
}

const AssetsBorrowItem = ({ src, name, balance, apr }: Asset) => {
  const btnDisabled = balance === 0 ? styles.disabled : ""

  return (
    <div className={styles.listRow}>
      <div className={styles.assetContainer}>
        <div>
          <Image
            src={src}
            alt={name}
          />
        </div>
        <div>{name}</div>
      </div>
      <div>{balance}</div>
      <div className={`${styles.largeCol} ${styles.center}`}>{apr}</div>
      <div className={styles.center}>
        <button className={`${styles.actionBtn} ${btnDisabled}`}>Borrow</button>
      </div>
    </div>
  )
}

export default AssetsBorrowItem