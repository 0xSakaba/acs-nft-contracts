// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const input_baseTokenURI =
  "ipfs://bafkreicnsnggeyb3ql6dbfmp5h24hvesz5bq2butnnqdqixp3ozj6vyalm";

const AstarNFTCommonModule = buildModule("AstarNFTCommonModule", (m) => {
  const baseTokenURI = m.getParameter("baseTokenURI", input_baseTokenURI);

  const CommonNFT = m.contract("AstarNFTCommon", [baseTokenURI]);

  return { CommonNFT };
});

export default AstarNFTCommonModule;
