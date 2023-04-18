import Image from 'next/image'
import { StaticImageData } from 'next/image'
import Loader from '@components/Loader'
import styles from './AssetsLendItem.module.css'

type Asset = {
  name: string
  src: StaticImageData
  balance: number
  apy: string
  isCollateral: boolean
  onLend: React.MouseEventHandler<HTMLButtonElement>
  isWithdraw?: boolean
  isLoading?: boolean
}

const AssetsLendItem = ({ src, name, balance, apy, isCollateral, onLend, isWithdraw, isLoading }: Asset) => {
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
      <div style={{position: "relative"}}>
        <div>
          {!isLoading && balance}
          {isLoading && <div><Loader /></div>}
        </div>
        {isWithdraw && <div style={{position: "absolute", bottom: "-5px", fontSize: 12, color: "#777"}}>$ {balance * 0.88}</div>}
      </div>
      <div className={`${styles.smallCol} ${styles.center}`}>{apy}</div>
      <div className={`${styles.center} ${collateralClass}`}>{collateral}</div>
      <div className={`${styles.center} ${styles.button}`}>
        {!isWithdraw && <button className={`${styles.actionBtn} ${btnDisabled}`} onClick={onLend}>Lend</button>}
        {!!isWithdraw && <button className={`${styles.actionBtn}`}>Withdraw</button>}
      </div>
    </div>
  )
}

export default AssetsLendItem