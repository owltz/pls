import { Pls } from './PLS'
import { PlsUser } from './PlsUser'
import { PlsMultisig } from './PlsMultisig'
import { PlsContract } from './PlsContract'

console.log('starting...')
const pls = new Pls()
const arbitrator = new PlsUser('Arbitrator', 'toss motion abandon voyage question child day gather drink cycle only payment')
const alice = new PlsUser('Alice', 'token bind moon roast extend label asset sense comfort require inspire civil')
const bob = new PlsUser('Bob', 'insect jacket enhance pink exact denial robust salmon gasp image mom champion')

console.log('Arbitrator address0:', arbitrator.address())
console.log('Alice address0:', alice.address())
console.log('Bob address0:', bob.address())

// 2.3.1.2.a
const filePath = './sample.pdf'
const fileHash = pls.generateFileHash(filePath)
console.log('fileHash', fileHash)

// 2.3.1.2.b
const multisig = new PlsMultisig(alice, bob)
console.log('Multisig address0:', multisig.address(), multisig.address() === 'tb1qfzx3xvlcu7g9r928zhperqya2emmdq4ds3jryhwa5mfjqdyz9glqeutxj9')

const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000
const contract = new PlsContract(alice, bob, null, arbitrator, null, (new Date()).getTime(), (new Date()).getTime() + threeMonths, fileHash)
