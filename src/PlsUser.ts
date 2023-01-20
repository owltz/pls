import * as bip39 from 'bip39'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import { payments, networks } from 'bitcoinjs-lib'

const bip32 = BIP32Factory(ecc)

export class PlsUser {
  constructor(
    public readonly name: string,
    public readonly mnemonic: string,
  ) { }

  public getAddress1() {
    const seed = bip39.mnemonicToSeedSync(this.mnemonic);
    const hdRoot = bip32.fromSeed(seed, networks.testnet);
    const childNode = hdRoot.derivePath("m/84'/1'/0'/0/0")
    const address = this.getAddress(childNode, childNode.network)

    return address
  }

  private getAddress(node: any, network?: any): string {
    return payments.p2wpkh({ pubkey: node.publicKey, network }).address!;
  }
}
