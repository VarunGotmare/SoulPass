
import { ethers } from "ethers";
import SoulpassNFT from "@/abi/SoulPassNFT.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

function getWallet() {
  return new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
}

export function getSoulPassContract() {
  const wallet = getWallet();
  return new ethers.Contract(
    process.env.CONTRACT_ADDR!,
    SoulpassNFT.abi,
    wallet
  );
}
