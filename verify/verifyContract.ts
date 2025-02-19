import hre from "hardhat";
import { sepolia_verify_address } from "../const";

const arg1 = "ipfs://";
async function main() {
  await hre.run("verify:verify", {
    address: "0xcBdbF291979BbaF4A69817E7EB5bCD4493c65eF5",
    constructorArguments: [arg1],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
