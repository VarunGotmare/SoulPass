const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // First Hardhat account
  const recipient = "0x1A678Daea6C342aEB7DA43D5942375E6B10ad60c"; // 🔁 Replace this!

  const tx = await deployer.sendTransaction({
    to: recipient,
    value: hre.ethers.parseEther("5.0"), 
  });

  console.log(`✅ Sent 5 ETH to ${recipient}`);
  console.log(`Tx Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
