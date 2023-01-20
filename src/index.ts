import { Pls } from './PLS'
import { PlsUser } from './PlsUser'

console.log('starting...')
const pls = new Pls()

// 2.3.1.2.a
const filePath = './sample.pdf'
const fileHash = pls.generateFileHash(filePath)
console.log('fileHash', fileHash)

// 4.1. Use the Bitcoin Testnet to create the multisig wallet (sec- tion 2.3.1, item 2)
