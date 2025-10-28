const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying MysteryBoxFHE to Sepolia (with FHE support)...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);

  // Get deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  console.log("⏳ Deploying contract...");
  const MysteryBoxFHE = await hre.ethers.getContractFactory("MysteryBoxFHE");
  const mysteryBox = await MysteryBoxFHE.deploy();

  await mysteryBox.waitForDeployment();
  const address = await mysteryBox.getAddress();

  console.log("✅ MysteryBoxFHE deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    contractName: "MysteryBoxFHE",
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    fheEnabled: true,
    gatewayUrl: "https://gateway.sepolia.zama.ai",
  };

  fs.writeFileSync(
    "deployment_fhe.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployment_fhe.json");

  // Verify contract code
  const code = await hre.ethers.provider.getCode(address);
  console.log(code !== "0x" ? "✅ Contract verified on chain" : "❌ Deployment failed!");

  console.log("\n📋 Next steps:");
  console.log("1. Copy the contract address to frontend/src/config/constants.ts");
  console.log("2. Update CONTRACT_ADDRESS_FHE in frontend");
  console.log("3. Fund the contract with ETH for prizes:");
  console.log(`   npx hardhat run scripts/fund_prizes.js --network sepolia`);
  console.log("4. Create a mystery box series from the frontend (FHE mode)");
  console.log("\n⚠️  Note: FHE mode requires Gateway to be online");
  console.log("   Check status: https://status.zama.ai/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });


