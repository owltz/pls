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
  public arbitrator = new PlsUser('Arbitrator', 'toss motion abandon voyage question child day gather drink cycle only payment')
  public alice = new PlsUser('Alice', 'token bind moon roast extend label asset sense comfort require inspire civil')
  public bob = new PlsUser('Bob', 'insect jacket enhance pink exact denial robust salmon gasp image mom champion')
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
    return new PlsMultisig(this.alice, this.bob)
  }

  async unspents(address: string) {
    return regtestUtils.unspents(address)
  }
}
