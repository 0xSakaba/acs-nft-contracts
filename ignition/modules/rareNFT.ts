// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const input_baseTokenURI =
  "ipfs://bafkreic6fdnprvvkat5hlgn4yeor5d6m5fwktdfpjjfogo6vdkboweqw4e";

const AstarNFTRareModule = buildModule("AstarNFTRareModule", (m) => {
  const baseTokenURI = m.getParameter("baseTokenURI", input_baseTokenURI);

  const RareNFT = m.contract("AstarNFTRare", [baseTokenURI]);

  return { RareNFT };
});

export default AstarNFTRareModule;
