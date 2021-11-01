import { useEffect, useState } from "react"
import Router from 'next/router'
import styles from './Uploader.module.css'

export function Uploader({onUploadHandler, contract}) {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    const onUploadFinish = () => {
      Router.push('/feed')
    }

    if (contract) {
      contract.on('ImageCreated', onUploadFinish);
    }

    return () => {
      if (contract) {
        contract.off('ImageCreated', onUploadFinish);
      }
    }
  }, [contract])

  const getFile = event => {
    event.preventDefault()
    const [file] = event.target.files
    setFile(file)
  }

  const onDescriptionHandler = event => {
    setDescription(event.target.value)
  }

  const onSubmit = event => {
    event.preventDefault()
    onUploadHandler(file, description)
  }

  return (<>
    <form onSubmit={onSubmit} className={styles.uploader__container}>
      <h2>Upload pictures of your CAT to the blockchain </h2>
      <div className={styles.uploader__section}>
        <label htmlFor='uploader' className={styles['uploader__upload-button']}>Choose the picture</label>
        <input id='uploader' type='file' accept='.jpg, .jpeg, .png, .gif' onChange={getFile} hidden/>
        <p>{file?.name}</p>
      </div>
      <div className={styles.uploader__section}>
        <textarea rows={3} maxLength='100' onChange={onDescriptionHandler} required placeholder="Tell more about your cat"/>
      </div>
      <div className={styles.uploader__section}>
        <button className={styles['uploader__submit-button']} type='submit'>Upload</button>
      </div>
    </form>
  </>)
}