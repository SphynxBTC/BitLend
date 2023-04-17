import Image from 'next/image'
import { StaticImageData } from "next/image"
import styles from './Lend.module.css'
import { useState } from 'react'

type Asset = {
  name: string
  src: StaticImageData
  balance: number
  apy: string
  isCollateral: boolean
  onClose: React.MouseEventHandler<HTMLButtonElement>
  onLend: Function
  valueDollar: number
}

const LendItem = ({ name, src, balance, apy, isCollateral, onClose, onLend, valueDollar }: Asset) => {
  const collateral = isCollateral ? "Yes" : "No"
  const collateralClass = isCollateral ? styles.green : styles.red
  const [value, setValue] = useState(0) 
  //const btnDisabled = value === 0 ? styles.disabled : ""
  const btnDisabled = styles.disabled
  const dollarValue = valueDollar * value
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{`Lend ${name}`}</div>
        <button className={styles.close} onClick={onClose}>X</button>
      </div>
      <div>
        <div className={styles.subtitle}>Amount</div>
        <div className={styles.group}>
          <div className={styles.inputWrapper}>
            <div className={styles.inputContainer}>
              <input onChange={(e) => setValue(Number(e.target.value) || 0)} placeholder='0.00' />
            </div>
            <div className={styles.asset}>
              <div>
                <Image
                  src={src}
                  alt={name}
                  />
              </div>
              <div className={styles.assetName}>{name}</div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowItem}>{`$ ${dollarValue}`}</div>
            <div className={styles.rowItem}>{`Balance: ${balance}`}</div>
          </div>
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles.row}>
          <div className={`${styles.rowItem} ${styles.rowInfo}`}>APY</div>
          <div className={`${styles.rowItem} ${styles.rowInfo}`}>{apy}</div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.rowItem} ${styles.rowInfo}`}>Can be used as colateral</div>
          <div className={`${collateralClass} ${styles.rowInfo}`}>{collateral}</div>
        </div>
      </div>
      <button 
        className={`${styles.actionBtn} ${btnDisabled}`}
        onClick={() => {}}
      >
        In Development
      </button>
    </div>
  )
}

export default LendItem