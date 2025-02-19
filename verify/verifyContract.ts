import hre from "hardhat";

const arg1 =
  "ipfs://bafkreicmhkxixbihhywewbvob63us56fsmpwd6cw7sv7gx3hkilv6yroli";
const arg2 = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441"; //ASTAR token address
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
