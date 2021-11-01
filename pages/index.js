import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import Web3 from 'web3'
import { useNetwork } from '../hooks/useNetwork'
import { useWallet } from '../hooks/useWallet'
import { Account } from '../components/account'
import { AlertNetwork } from '../components/alert'
import styles from '../styles/Home.module.css'
import { useContract } from '../hooks/useContract'
import { Uploader } from '../components/uploader'
import { Feed } from '../components/feed'

export default function Home() {
  const { account, connect } = useWallet()
  const { correctNetwork } = useNetwork()

  useEffect(() => {
    if (account && correctNetwork) {
      Router.push('/feed')
    }
  }, [account, correctNetwork])

  return (
    <div className={styles.container}>
      <Head>
        <title>🐱 ShowMeYourCat</title>
        <meta name="description" content="ShowMeYourCat" />
      </Head>

      <main className={styles.main}>
          {!correctNetwork && <AlertNetwork />}
          <p className={styles.home__logo}>🐱 ShowMeYourCat</p>
          <Account account={account} connect={connect} />
      </main>

      <footer className={styles.footer}>
        <p>Made with ❤ from Buenos Aires</p>
        <p>I&apos;m <a href='https://twitter.com/timbislopez'>@timbislopez</a> on Twitter</p>
      </footer>
    </div>
  )
}
