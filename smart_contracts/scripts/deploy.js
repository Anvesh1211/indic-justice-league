const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying EvidenceVault contract...");
  
  const EvidenceVault = await ethers.getContractFactory("EvidenceVault");
  const contract = await EvidenceVault.deploy();
  await contract.deployed();
  
  console.log("✅ EvidenceVault deployed to:", contract.address);
  console.log("📋 Save this address to your .env file as CONTRACT_ADDRESS");
  console.log("\nVerifying deployment...");
  
  // Test the contract
  const count = await contract.getEvidenceCount();
  console.log("✅ Contract verified! Initial evidence count:", count.toString());
  
  console.log("\n🔧 Next steps:");
  console.log("1. Copy the contract address to backend/.env");
  console.log("2. Copy artifacts/contracts/EvidenceVault.sol/EvidenceVault.json to backend/app/data/abi/");
  console.log("3. Update POLYGON_RPC_URL and PRIVATE_KEY in .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
