const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Replace with your deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ← 🛑 Update this

  const soulPass = await hre.ethers.getContractAt("SoulPassNFT", contractAddress);

  // Your uploaded metadata URIs from Pinata (replace these with actual values)
  const hacktoberfestUri = "ipfs://bafkreib2qs64vrdecinr2f2ggcwzezmrsmtfuz4pxdg2iiexfiwdwlizcm";
  const soulpassUri = "ipfs://bafkreibbqlufmquq4d354lvfaqpsrxg4rt6opnvpd4qalxlhj4qf7h6zhe";

  // Preload claim codes
  const tx1 = await soulPass.setClaimCode("ABC123", hacktoberfestUri);
  await tx1.wait();
  console.log("✅ Set claim code ABC123 for Hacktoberfest 2025");

  const tx2 = await soulPass.setClaimCode("XYZ789", soulpassUri);
  await tx2.wait();
  console.log("✅ Set claim code XYZ789 for SoulPass Launch 2025");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
