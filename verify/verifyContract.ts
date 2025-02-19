import hre from "hardhat";

const arg1 = "ipfs://";
const arg2 = "0x";
async function main() {
  await hre.run("verify:verify", {
    address: "",
    constructorArguments: [arg1, arg2],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
