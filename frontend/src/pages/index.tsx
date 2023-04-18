import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import MainConnect from "@components/MainConnect"
import AssetsGroup from "@components/AssetsGroup"
import AssetsLendItem from "@components/AssetsLendItem"
import AssetsBorrowItem from "@components/AssetsBorrowItem"
import LendPopUp from "@components/Lend"
import { InfoIcon } from '@components/Svg'
import { userSession } from '@utils/userSession'
import getSTXBalance from "@utils/getSTXBalance"
import getBTCBalance from "@utils/getBTCBalance"
import reload from "@utils/reload"
import styles from '@styles/Home.module.css'
import bitcoinLogo from '@assets/bitcoin_logo.webp'
import stacksLogo from '@assets/stacks_logo.webp'
import BitLendLogo from '@assets/logo.jpg'

const initState = {
  name: "",
  src: bitcoinLogo,
  balance: 0,
  apy: "",
  isCollateral: false,
  valueDollar: 0
}
export default function Home() {
  const [userIsConnected, setUserIsConnected] = useState(false)
  const [stxBalance, setStxBalance] = useState(0)
  const [btcBalance, setBtcBalance] = useState(0)
  const [network, setNetwork] = useState("")
  const [showLend, setShowLend] = useState(initState)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const net = localStorage.getItem("network")
    if (!net) {
      localStorage.setItem("network", "testnet")
      setNetwork("testnet")
    } else {
      setNetwork(net)
    }

    const isUserSignedIn = userSession.isUserSignedIn()
    setUserIsConnected(isUserSignedIn)

    if (isUserSignedIn) {
      setIsLoading(true)
      getBalances()
    }
  }, [])

  const changeNetwork = () => {
    if (network === "mainnet") localStorage.setItem("network", "testnet")
    else localStorage.setItem("network", "mainnet")
    reload()
  }

  const logOut = () => {
    userSession.signUserOut()
    reload()
  }

  const getBalances = async () => {
    const net = localStorage.getItem("network") || "mainnet"
    const isMainnet = net === "mainnet"
    const loadUserData = userSession.loadUserData()
    const stxAddress = loadUserData.profile.stxAddress[net]
    const btcAddress = loadUserData.profile.btcAddress.p2wpkh[net]
    const _stxBalance = await getSTXBalance(stxAddress, isMainnet)
    const _btcBalance = await getBTCBalance(btcAddress, isMainnet)
    
    setStxBalance(_stxBalance || 0)
    setBtcBalance(_btcBalance || 0)
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>BitLend</title>
        <meta name="description" content="A Decentralized Lending Marketplace Built on Bitcoin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image
              src={BitLendLogo}
              alt="BitLend"
            />
          </div>
          {userIsConnected && (
            <div>
              <button onClick={changeNetwork} className={styles.network}>{network}</button>
              <button onClick={logOut} className={styles.disconnectBtn}>Disconnect</button>
            </div>
          )}
        </header>
        <div className={styles.survey}>
          <a 
            href="https://blocksurvey.io/survey/p/59b98bd3-1fc7-4e3d-ac3d-92b4d1eb9d40/r/o" 
            target="_blank"
          >
            Complete this brief survey to be added to the waitlist of our beta launch
          </a>
        </div>
        {!userIsConnected && <MainConnect />}
        {userIsConnected &&
          <main className={styles.main}>
            <div className={styles.boxWrapper}>
              <AssetsGroup title="Loaned Assets">
                <div className={styles.listMessage}>Nothing loaned yet.</div>
                {/* <>
                  <div className={`${styles.listRow} ${styles.listHeader}`}>
                    <div>Assets</div>
                    <div>Balance</div>
                    <div className={`${styles.smallCol} ${styles.center}`}>APY</div>
                    <div>Collateral</div>
                    <div className={styles.lastCol} />
                  </div>
                  <AssetsLendItem
                    name="STX"
                    src={stacksLogo}
                    balance={stxBalance}
                    apy="2%"
                    isCollateral={true}
                    onLend={() => {}}
                    isWithdraw={true}
                  />
                </>*/}
              </AssetsGroup>
              <AssetsGroup title="Borrowed Assets">
                <div className={styles.listMessage}>Nothing borrowed yet.</div>
              </AssetsGroup>
            </div>
            <div className={styles.boxWrapper}>
              <AssetsGroup title="Assets to Lend">
                <>
                  <div className={`${styles.listRow} ${styles.listHeader}`}>
                    <div>Assets</div>
                    <div>Balance</div>
                    <div className={`${styles.smallCol} ${styles.center}`}>APY</div>
                    <div>Collateral</div>
                    <div className={styles.lastCol} />
                  </div>
                  <AssetsLendItem
                    name="BTC"
                    src={bitcoinLogo}
                    balance={btcBalance}
                    apy="5%"
                    isCollateral={false}
                    onLend={() => {}}
                    isLoading={isLoading}
                    />
                  <AssetsLendItem
                    name="STX"
                    src={stacksLogo}
                    balance={stxBalance}
                    apy="2%"
                    isCollateral={true}
                    onLend={() => {}}
                    isLoading={isLoading}
                  />
                </>
              </AssetsGroup>
              <AssetsGroup title="Assets to Borrow">
                <>
                  {true &&
                    <div className={styles.info}>
                      <div className={styles.infoIcon}>
                        <InfoIcon />
                      </div>
                      <div>
                        To borrow you need to supply an asset to be used as collateral.
                      </div>
                    </div>
                  }
                  <div className={`${styles.listRow} ${styles.listHeader}`}>
                    <div>Assets</div>
                    <div>Available</div>
                    <div className={`${styles.largeCol} ${styles.center}`}>Interest (APR)</div>
                    <div className={styles.lastCol} />
                  </div>
                  <AssetsBorrowItem
                    name="sBTC"
                    src={bitcoinLogo}
                    balance={0}
                    apr="2%"
                  />
                  <AssetsBorrowItem
                    name="STX"
                    src={stacksLogo}
                    balance={0}
                    apr="3%"
                  />
                </>
              </AssetsGroup>
            </div>
          </main>
        } 
     </div>
     {showLend?.name &&
      <div className={styles.popUpContainer}>
          <LendPopUp
            name={showLend.name}
            src={showLend.src}
            balance={showLend.balance}
            apy={showLend.apy}
            isCollateral={showLend.isCollateral}
            valueDollar={showLend.valueDollar}
            onClose={() => setShowLend(initState)}
            onLend={(value: number) => {
              setShowLend(initState)
            }}
            />
        </div>
      }
    </>
  )
}
