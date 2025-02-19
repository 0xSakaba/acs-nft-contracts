import hre from "hardhat";

const arg1 =
  "ipfs://bafkreicmhkxixbihhywewbvob63us56fsmpwd6cw7sv7gx3hkilv6yroli";
const arg2 = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441"; //ASTAR token address
async function main() {
  await hre.run("verify:verify", {
    address: "0xf3f8C65E983b414Aaa4D7662C5eBa81E4d27EAB4",
    constructorArguments: [arg1, arg2],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
