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

### soneium (mainnet)

can mint 
from 00:00:00 UTC Feb. 20th 2025
to 23:59:59 UTC May. 30th 2025

### sepolia

can mint from 18:00 JST - 23:00 JST Feb. 19th

MockErc20Module#MockErc20 - 0x75f35c739B5f5CA81634E51CAB9623e7D7FaBFb4

SonovaACSContractModule#SonovaACSContract - 0xeDa4640961378474aFEC6F1D231F79ADB045FE82

- opensea: https://testnets.opensea.io/assets/sepolia/0xeda4640961378474afec6f1d231f79adb045fe82/2


### soneium-minato (testnet)

can mint from 18:00 JST - 23:00 JST Feb. 19th

MockErc20Module#MockErc20 - 0xEecD02C2E160516aD2bd0e089e7d6d83D558cA25

SonovaACSContractModule#SonovaACSContract - 0xe82d879ee0Df983148eBf28DB7E7C213E40510Fc


### spec docs:

https://www.notion.so/Sonova-ACS-edition-19fea68ada958000b37fc8551b09c39c

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
