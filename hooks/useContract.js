import { ethers } from "ethers"
import { useEffect, useState } from "react"
import abi from '../abi/ShowMeYourCat.json'

const contractAddress = "0xcC965F0A10f96294186373559Fd5b9760057B645"
const contractABI = abi.abi

export function useContract(){
  const [contract, setContract] = useState(null)

  useEffect(() => {
    getContract()
  }, [])

  const getContract = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        setContract(contract)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    contract
  }
}