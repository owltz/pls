import { PlsTestsHelper } from './PlsTestsHelper'

console.log('starting...')

// hashing validation (move to unitary test)
// const plsHashed = plsStringHash('private law society')
// console.log('plsHashed', plsHashed, plsHashed === '5e886af3a2a2aa842b42151f8e6237cbe25d7d041865b9edebff6a0509105e2d')

const app = async() => {
  const pls = new PlsTestsHelper()

  // setup contract and multisig
  const contract = await pls.buildContract()
  const multisig = await pls.buildMulitsig()

  console.log('Arbitrator address0:', pls.arbitrator.addressSinglesig())
  console.log('Alice address0:', pls.alice.addressSinglesig())
  console.log('Bob address0:', pls.bob.addressSinglesig())

  console.log('contract.asJSON()', contract.asJSON())

  // 2.3.1.2.a - generates the PDF file hash
  console.log('fileHash', contract.fileHash)
  console.log('contractHash', contract.generatePlsContractHash())

  // 2.3.1.2.b - creates a multisig (2 of 2) wallet for the contract
  console.log('Multisig address0:', multisig.address(), multisig.address() === 'tb1qfzx3xvlcu7g9r928zhperqya2emmdq4ds3jryhwa5mfjqdyz9glqeutxj9')

  // 2.3.1.3 - creates UTXO with the filehash

}

app()
