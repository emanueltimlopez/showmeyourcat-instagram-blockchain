import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import Web3 from 'web3'
import confetti from 'canvas-confetti'
import { useNetwork } from '../hooks/useNetwork'
import { useWallet } from '../hooks/useWallet'
import { Account } from '../components/account'
import { AlertNetwork } from '../components/alert'
import styles from '../styles/Feed.module.css'
import { useContract } from '../hooks/useContract'
import { Uploader } from '../components/uploader'
import { Feed } from '../components/feed'

export default function Home() {
  const { account, connect } = useWallet()
  const { correctNetwork } = useNetwork()
  const { contract } = useContract()
  const [isLoading, setIsLoading] = useState(true)
  const [processingTip, setProcessingTip] = useState(false)
  const [images, setImages] = useState([])

  useEffect(() => {
    const getImages = async () => {
      const imageCount = await contract.imageCount()
      for (let i = imageCount.toNumber(); i > 0; i -= 1) {
        const image = await contract.images(i)
        setImages(prevState => [...prevState, image])
      }
      setIsLoading(false)
    }
    if (account && correctNetwork && contract) {
      contract.on('ImageTipped', onTipConfirmed);
      getImages()
    }

    return () => {
      if (contract) {
        contract.off('ImageTipped', onTipConfirmed);
      }
    }
  }, [account, correctNetwork, contract])

  const tipOwner = async event => {
    const tipAmount = Web3.utils.toWei('0.001', 'Ether')
    contract.tipOwner(event.target.name, {value: tipAmount})
    setProcessingTip(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  const gotToUpload = () => {
    Router.push('/upload')
  }

  const onTipConfirmed = () => {
    setProcessingTip(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>🐱 ShowMeYourCat</title>
        <meta name="description" content="ShowMeYourCat" />
      </Head>

      <header className={styles.header__container}>
        <p></p>
        <p className={styles.header__logo}>🐱 ShowMeYourCat</p>
        <button className={styles['header__button-upload']} onClick={gotToUpload}><img src='/imgs/upload.png'/></button>
      </header>

      <main className={styles.main}>
        {!correctNetwork && <AlertNetwork />}
        {account && isLoading && correctNetwork && <p>Loading feed...</p> }
        <Feed images={images} tipOwner={tipOwner} processingTip={processingTip}/>
      </main>
    </div>
  )
}
