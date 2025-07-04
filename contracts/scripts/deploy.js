const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const SoulPassFactory = await hre.ethers.getContractFactory("SoulPassNFT");
  const soulPass = await SoulPassFactory.deploy(deployer.address);
  await soulPass.waitForDeployment();

  console.log("✅ SoulPassNFT deployed at:", await soulPass.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0