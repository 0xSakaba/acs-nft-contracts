// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const input_baseTokenURI =
  "ipfs://bafkreicmhkxixbihhywewbvob63us56fsmpwd6cw7sv7gx3hkilv6yroli";
const input_paymentTokenAddress = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441"; // already change to $ASTAR in mainnet

const SonovaACSContractModule = buildModule("SonovaACSContractModule", (m) => {
  const baseTokenURI = m.getParameter("baseTokenURI", input_baseTokenURI);
  const paymentToken = m.getParameter(
    "paymentToken",
    input_paymentTokenAddress
  );

  const SonovaACS = m.contract("SonovaACSContract", [
    baseTokenURI,
    paymentToken,
  ]);

  return { SonovaACS };
});

export default SonovaACSContractModule;
