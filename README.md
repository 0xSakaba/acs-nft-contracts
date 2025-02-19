# set up env

`yarn hardhat vars set ALCHEMY_API_KEY "YOUR_TOKEN_HERE"`
`yarn hardhat vars set ETHERSCAN_API_KEY "YOUR_TOKEN_HERE"`

`npx hardhat vars list`

deploy contract
```shell
npx hardhat ignition deploy ./ignition/modules/<contractName>.ts --network <network>
```

run scripts
```shell
npx hardhat run ./scripts/<scriptName>.ts --network <network>
```

contract verification
```shell
npx hardhat run ./verify/<name>.ts --network <network> <contractAddress>
```

# deploy

soneium (mainnet)

AstarNFTCommonModule#AstarNFTCommon - 0xAF27443284F86CBdc1fa71941e8B787e5A4440De

AstarNFTRareModule#AstarNFTRare - 0xcBdbF291979BbaF4A69817E7EB5bCD4493c65eF5


sepolia

AstarNFTCommonModule#AstarNFTCommon - 0x12516c9cC0d52eAec44737BB15f0A805628fE26B

AstarNFTRareModule#AstarNFTRare - 0x31896d4544AEf14045f34c90Fb4fbE5D96cD0470

soneium-minato (testnet)

AstarNFTCommonModule#AstarNFTCommon - 0x55D30Ba332AdA10478e5aBbcA3400253bD5281E4

AstarNFTRareModule#AstarNFTRare - 0x15A580c90B10bF98dFe66f28B8e96D08150Cb6a4

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
