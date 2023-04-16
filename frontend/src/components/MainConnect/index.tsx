import Image from 'next/image'
import authenticate from "@utils/authenticate"
import hiroLogo from '@assets/hiro_logo.png'
import styles from './MainConnect.module.css'

const MainConnect = () => {
  return (
    <div className={styles.connect}>
      <div>Connect with Hiro Wallet</div>
      <div>to start using the app</div>
      <button onClick={authenticate} className={styles.connectBtn}>
        <div>
          <Image
            src={hiroLogo}
            alt="Hiro"
            className={styles.hiroLogo}
          />
        </div>
        <div className={styles.connectBtnText}>Connect</div>
      </button>
    </div>
  )
}

export default MainConnect
