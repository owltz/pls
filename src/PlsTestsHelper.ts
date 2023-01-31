import { RegtestUtils } from 'regtest-client'
import * as bitcoin from 'bitcoinjs-lib'
import ECPairFactory from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import { PlsUser } from './PlsUser'
import { PlsMultisig } from './PlsMultisig'
import { PlsContract } from './PlsContract'
import { plsFileHash } from './PlsHash'

const ECPair = ECPairFactory(ecc)

export const regtestUtils = new RegtestUtils()
const network = regtestUtils.network // regtest network params

const validator = (
  pubkey: Buffer,
  msghash: Buffer,
  signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature)

export class PlsTestsHelper {
  public filePath = './docs/PLS-challenge0-9-1.pdf'
  public arbitrator = new PlsUser('Arbitrator', 'toss motion abandon voyage question child day gather drink cycle only payment', network)
  public alice = new PlsUser('Alice', 'token bind moon roast extend label asset sense comfort require inspire civil', network)
  public bob = new PlsUser('Bob', 'insect jacket enhance pink exact denial robust salmon gasp image mom champion', network)
  public contractPeriod = 3 * 30 * 24 * 60 * 60 * 1000 // 3 months

  constructor(
  ) { }

  async fileHash() {
    return await plsFileHash(this.filePath)
  }

  async buildContract() {
    return new PlsContract(
      this.alice.dataForMultisig(0).publicKey.toString('hex'),
      this.bob.dataForMultisig(0).publicKey.toString('hex'),
      '',
      this.arbitrator.dataForMultisig(0).publicKey.toString('hex'),
      '',
      (new Date()).getTime(),
      (new Date()).getTime() + this.contractPeriod,
      await this.fileHash()
    )
  }

  async buildMulitsig() {
    return new PlsMultisig(this.alice, this.bob, network)
  }

  async fundAddress(address: string, value: number) {
    return regtestUtils.faucet(address, value)
  }

  async buildSecurityDeposit(data: PlsTransaction) {
    const fileHash = await this.fileHash()
    const unspents = await regtestUtils.unspents(data.fromAddress)
    const unspentInput0 = unspents[0] // TODO: find the best unspent, use more than one
    const transaction0 = await regtestUtils.fetch(unspentInput0.txId)
    const nonWitnessUtxo = Buffer.from(transaction0.txHex, 'hex')

    const psbt = new bitcoin.Psbt({ network })
    psbt.addInput({
      hash: unspentInput0.txId,
      index: unspentInput0.vout,
      nonWitnessUtxo,
    })
    psbt.addOutput({
      address: data.toAddress,
      value: data.value,
    })
    // add change output!
    psbt.addOutput({
      script: bitcoin.payments.embed({
        data: [
          Buffer.from(`PLS${fileHash}`, 'utf8')
        ]
      }).output!,
      value: 0, // TODO: check if this is needed
    })
    console.log('psbt', psbt.data.globalMap)
    psbt.signInput(0, data.signer.dataForSinglesig(0).childNode) // TODO: get right signer!!!
    // console.log('psbt.validateSignaturesOfInput(0, validator)', psbt.validateSignaturesOfInput(0, validator)) // TODO: check best way to validate
    psbt.finalizeAllInputs()

    let txId = Buffer.from(psbt.extractTransaction().ins[0].hash).reverse().toString('hex')
    console.log('txId', txId)

    return psbt
  }

  async broadcast(psbt: bitcoin.Psbt) {
    return regtestUtils.broadcast(psbt.extractTransaction().toHex());
  }

  async balance(address: string) {
    return (await regtestUtils.unspents(address))
      .reduce((prev, curr) => prev + curr.value, 0)
  }

  async unspents(address: string) {
    return regtestUtils.unspents(address)
  }
}

export interface PlsTransaction {
  value: number,
  fromAddress: string,
  toAddress: string,
  signer: PlsUser,
}
