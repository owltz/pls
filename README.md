
### Online Decoders

btc-transaction: https://www.blockchain.com/explorer/assets/btc/decode-transaction

op_return data: https://www.hextotext.com/en/convert-hex-to-text


### Setup regtest

This docker image runs a Bitcoin node with --regtest flag (regression tests), and a rest server able to get coins from faucet or mine n blocks instantly.

```
docker run --name bitcoin-regtest -p 8080:8080 junderw/bitcoinjs-regtest-server
```


### Library:

https://github.com/bitcoinjs/bitcoinjs-lib


### Install pnpm and run:

```
pnpm init
pnpm start
```
