import { PlsTestsHelper } from './PlsTestsHelper'

console.log('starting...')

// hashing validation (move to unitary test)
// const plsHashed = plsStringHash('private law society')
// console.log('plsHashed', plsHashed, plsHashed === '5e886af3a2a2aa842b42151f8e6237cbe25d7d041865b9edebff6a0509105e2d')

const app = async() => {
  const printBalances = async () => {
    console.log('arbitrator balance:', await pls.balance(pls.arbitrator.addressSinglesig(0)))
    console.log('alice balance:', await pls.balance(pls.alice.addressSinglesig(0)))
    console.log('bob balance:', await pls.balance(pls.bob.addressSinglesig(0)))
    console.log('multisig balance:', await pls.balance(multisig.address(0)))
    console.log('-----')
  }

  const pls = new PlsTestsHelper()

  // setup contract and multisig
  const contract = await pls.buildContract()
  const multisig = await pls.buildMulitsig()

  console.log('Arbitrator address0:', pls.arbitrator.addressSinglesig(0))
  console.log('Alice address0:', pls.alice.addressSinglesig(0))
  console.log('Bob address0:', pls.bob.addressSinglesig(0))
  console.log('-----')
  console.log('contract.asJSON()', contract.asJSON())
  console.log('-----')
  await printBalances()

  console.log('>>> 2.3.1.2.a - generates the PDF file hash <<<')
  console.log('fileHash', contract.fileHash)
  console.log('contractHash', contract.generatePlsContractHash())
  console.log('-----')

  console.log('>>> 2.3.1.2.b - creates a multisig (2 of 2) wallet for the contract <<<')
  console.log(
    'Multisig address0:',
    multisig.address(0),
    multisig.address(0) === 'tb1qfzx3xvlcu7g9r928zhperqya2emmdq4ds3jryhwa5mfjqdyz9glqeutxj9' // testnet
      || multisig.address(0) === 'bcrt1qfzx3xvlcu7g9r928zhperqya2emmdq4ds3jryhwa5mfjqdyz9glq59pq8l' // regtest
  )
  console.log('-----')

  console.log('>>> alice and bob singlesig address 0s funding <<<')
  await pls.fundAddress(pls.alice.addressSinglesig(0), 20000)
  await pls.fundAddress(pls.bob.addressSinglesig(0), 20000)
  await printBalances()

  console.log('>>> 2.3.1.3a - alice transfer collateral into the multisig <<<')
  const psbtAlice = await pls.buildSecurityDeposit({
    value: 18000,
    fromAddress: pls.alice.addressSinglesig(0),
    toAddress: multisig.address(0),
    signer: pls.alice.dataForSinglesig(0).childNode,
  })

  console.log('alice txid:', psbtAlice.extractTransaction().getId())
  console.log('alice tx hex:', psbtAlice.extractTransaction().toHex())
  await pls.broadcast(psbtAlice)
  await printBalances()

  console.log('>>> 2.3.1.3b - bob transfer collateral into the multisig <<<')
  const psbtBob = await pls.buildSecurityDeposit({
    value: 18000,
    fromAddress: pls.bob.addressSinglesig(0),
    toAddress: multisig.address(0),
    signer: pls.bob.dataForSinglesig(0).childNode,
  })

  console.log('bob txid:', psbtBob.extractTransaction().getId())
  console.log('bob tx hex:', psbtBob.extractTransaction().toHex())
  await pls.broadcast(psbtBob)
  await printBalances()

  console.log('>>> 2.3.1.3c - creates dispute transaction from multisig to arbitrator <<<')
  const psbtArbitrator = await pls.buildArbitrationTransaction({
    value: 35000,
    fromAddress: multisig.address(0),
    toAddress: pls.arbitrator.addressSinglesig(0),
    signer: pls.bob.dataForMultisig(0).childNode,
    signer2: pls.alice.dataForMultisig(0).childNode,
    payment: multisig.payment(0),
  })

  console.log('bob txid:', psbtArbitrator.extractTransaction().getId())
  console.log('bob tx hex:', psbtArbitrator.extractTransaction().toHex())
  await printBalances()

  console.log('>>> 2.3.1.3d - broadcasts dispute transaction from multisig to arbitrator <<<')
  await pls.broadcast(psbtArbitrator)
  await printBalances()
}

app()
