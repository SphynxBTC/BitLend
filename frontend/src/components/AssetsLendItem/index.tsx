import Image from 'next/image'
import { StaticImageData } from "next/image"
import styles from './AssetsLendItem.module.css'

type Asset = {
  name: string
  src: StaticImageData
  balance: number
  apy: string
  isCollateral: boolean
}

const AssetsLendItem = ({ src, name, balance, apy, isCollateral }: Asset) => {
  const btnDisabled = balance === 0 ? styles.disabled : ""
  const collateral = isCollateral ? "Yes" : "No"
  const collateralClass = isCollateral ? styles.green : ""

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
      <div className={`${styles.smallCol} ${styles.center}`}>{apy}</div>
      <div className={`${styles.center} ${collateralClass}`}>{collateral}</div>
      <div className={styles.center}>
        <button className={`${styles.actionBtn} ${btnDisabled}`}>Lend</button>
      </div>
    </div>
  )
}

export default AssetsLendItem