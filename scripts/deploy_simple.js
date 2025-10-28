const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying MysteryBoxSimple to Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);

  // Get deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const MysteryBoxSimple = await hre.ethers.getContractFactory("MysteryBoxSimple");
  const mysteryBox = await MysteryBoxSimple.deploy();

  await mysteryBox.waitForDeployment();
  const address = await mysteryBox.getAddress();

  console.log("✅ MysteryBoxSimple deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    contractName: "MysteryBoxSimple",
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  fs.writeFileSync(
    "deployment_simple.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployment_simple.json");

  // Verify contract code
  const code = await hre.ethers.provider.getCode(address);
  console.log(code !== "0x" ? "✅ Contract verified on chain" : "❌ Deployment failed!");

  console.log("\n📋 Next steps:");
  console.log("1. Copy the contract address to frontend/src/config/constants.ts");
  console.log("2. Fund the contract with ETH for prizes:");
  console.log(`   npx hardhat run scripts/fund_prizes.js --network sepolia`);
  console.log("3. Create a mystery box series from the frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });


