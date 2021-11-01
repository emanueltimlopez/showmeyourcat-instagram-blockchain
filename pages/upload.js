import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import Web3 from 'web3'
import { useNetwork } from '../hooks/useNetwork'
import { useWallet } from '../hooks/useWallet'
import { Account } from '../components/account'
import { AlertNetwork } from '../components/alert'
import styles from '../styles/Upload.module.css'
import { useContract } from '../hooks/useContract'
import { Uploader } from '../components/uploader'
import { Feed } from '../components/feed'

export default function Home() {
  const { account, connect } = useWallet()
  const { correctNetwork } = useNetwork()
  const { contract } = useContract()
  const [isLoading, setIsLoading] = useState(false)

  const onUploadHandler = async (file, description) => {
    var formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
        method: 'POST',
        body: formData
      })
      setIsLoading(true)
      const data = await response.json()
      const txn = await contract.uploadImage(data.Hash, description)
      await txn.wait();
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const gotToFeed = () => {
    Router.push('/feed')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>🐱 ShowMeYourCat</title>
        <meta name="description" content="ShowMeYourCat" />
      </Head>

      <header className={styles.header__container}>
        <button className={styles['header__button-back']} onClick={gotToFeed}><img src='/imgs/back.png'/></button>
        <p>🐱 ShowMeYourCat</p>
        {/*<Account account={account} connect={connect} />*/}
      </header>

      <main className={styles.main}>
        {!correctNetwork && <AlertNetwork />}
        {account && isLoading && correctNetwork && <p>Wait please...</p> }
        <Uploader onUploadHandler={onUploadHandler} contract={contract}/>
      </main>
    </div>
  )
}
