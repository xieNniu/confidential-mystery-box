const { ethers } = require('ethers');

async function main() {
  const privateKey = "0x4488b744123dfb0d60b4744c2791e1865343ff5783f35e7308718815661ba1e8";
  const rpcUrl = "https://eth-sepolia.public.blastapi.io";
  
  console.log("💰 检查钱包余额...\n");
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("📍 钱包地址:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("💵 余额:", balanceInEth, "ETH");
  
  if (parseFloat(balanceInEth) < 0.05) {
    console.log("\n⚠️  警告: 余额不足！");
    console.log("   需要至少 0.05 ETH 用于部署");
    console.log("   请访问水龙头获取测试币: https://sepoliafaucet.com/");
  } else {
    console.log("\n✅ 余额充足，可以开始部署！");
  }
  
  const network = await provider.getNetwork();
  console.log("\n🌐 网络信息:");
  console.log("   Chain ID:", network.chainId.toString());
  console.log("   Network:", network.name);
}

main().catch(console.error);


