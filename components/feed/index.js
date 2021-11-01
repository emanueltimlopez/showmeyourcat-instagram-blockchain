
import image from 'next/image'
import Img from 'next/image'
import Web3 from 'web3'
import styles from './Feed.module.css'

function ImageComponent({author, hash, description, tipAmount, tipOwner, id, processingTip}) {
  const getTips = () => Web3.utils.fromWei(tipAmount.toString(), 'Ether')
  return (<div className={styles.feed__item}>
    <p className={styles.feed__owner}>{author}</p>
    <div className={styles.image__container}>
      <Img src={`https://ipfs.infura.io/ipfs/${hash}`} layout='fill' objectFit='contain'/>
    </div>
    <p className={styles.feed__description}>{description}</p>
    <div className={styles.feed__tip}>
      {processingTip && <p>The transaction is being processed...</p>}
      {!processingTip && (<>
        <p>Tips: {getTips()} Ether</p>
        <button name={id.toNumber()} onClick={tipOwner}>Tip 0.001 Ether</button>
      </>)}
    </div>
  </div>)
}

export function Feed({ images, tipOwner, processingTip }) {
  return (<div className={styles.feed__container}>
    {images.map(image => <ImageComponent key={image.hash} {...image} tipOwner={tipOwner} processingTip={processingTip}/>)}
  </div>)
}