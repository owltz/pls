import { Pls } from './PLS'
import { PlsUser } from './PlsUser'

console.log('starting...')
const pls = new Pls()
const alice = new PlsUser('Alice', 'token bind moon roast extend label asset sense comfort require inspire civil')
const bob = new PlsUser('Bob', 'insect jacket enhance pink exact denial robust salmon gasp image mom champion')

console.log('Alice address1:', alice.getAddress1())
console.log('Bob address1:', bob.getAddress1())

// 2.3.1.2.a
const filePath = './sample.pdf'
const fileHash = pls.generateFileHash(filePath)
console.log('fileHash', fileHash)

// 4.1. Use the Bitcoin Testnet to create the multisig wallet (sec- tion 2.3.1, item 2)
