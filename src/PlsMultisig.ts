import * as bip39 from 'bip39'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import { payments, networks } from 'bitcoinjs-lib'
import { PlsUser } from './PlsUser'

const bip32 = BIP32Factory(ecc)

export class PlsMultisig {
  constructor(
    public readonly user1: PlsUser,
    public readonly user2: PlsUser,
  ) { }

  public address(num: number = 0) {
    const publickeyUsr1 = this.publickeyFor(this.user1, num)
    const publickeyUsr2 = this.publickeyFor(this.user2, num)

    const pubkeys = [publickeyUsr1, publickeyUsr2].sort()

    const { address } = payments.p2wsh({
      redeem: payments.p2ms({ m: 2, pubkeys, network: networks.testnet }),
    })

    return address
  }

  private publickeyFor(user: PlsUser, num: number) {
    const seed1 = bip39.mnemonicToSeedSync(user.mnemonic);
    const hdRoot1 = bip32.fromSeed(seed1, networks.testnet);
    const childNode1 = hdRoot1.derivePath(`m/48'/1'/0'/2'/0/${num}`)

    return childNode1.publicKey
  }
}
