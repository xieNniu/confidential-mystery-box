const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  // Read private key from environment variable
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('❌ PRIVATE_KEY not found in .env file. Please set it first.');
  }
  
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.public.blastapi.io";
  
  console.log("💰 Checking wallet balance...\n");
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("📍 Wallet address:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("💵 Balance:", balanceInEth, "ETH");
  
  if (parseFloat(balanceInEth) < 0.05) {
    console.log("\n⚠️  Warning: Insufficient balance!");
    console.log("   Need at least 0.05 ETH for deployment");
    console.log("   Get testnet ETH from: https://sepoliafaucet.com/");
  } else {
    console.log("\n✅ Balance sufficient, ready to deploy!");
  }
  
  const network = await provider.getNetwork();
  console.log("\n🌐 Network info:");
  console.log("   Chain ID:", network.chainId.toString());
  console.log("   Network:", network.name);
}

main().catch(console.error);


