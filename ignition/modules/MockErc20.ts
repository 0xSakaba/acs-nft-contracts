// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MockErc20Module = buildModule("MockErc20Module", (m) => {
  const MockErc20 = m.contract("MockErc20", ["MockErc20", "MERC"]);

  return { MockErc20 };
});

export default MockErc20Module;
