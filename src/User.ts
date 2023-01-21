import * as bip39 from 'bip39'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import { payments, networks } from 'bitcoinjs-lib'

const bip32 = BIP32Factory(ecc)

export class User {
  constructor(
    public readonly name: string,
    public readonly mnemonic: string,
  ) { }

  public address(num: number = 0) {
    const seed = bip39.mnemonicToSeedSync(this.mnemonic);
    const hdRoot = bip32.fromSeed(seed, networks.testnet);
    const childNode = hdRoot.derivePath(`m/84'/1'/0'/0/${num}`)
    const address = payments.p2wpkh({ pubkey: childNode.publicKey, network: networks.testnet }).address!

    return address
  }
}
