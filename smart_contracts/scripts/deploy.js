const { ethers } = require("hardhat");

async function main() {
  const EvidenceVault = await ethers.getContractFactory("EvidenceVault");
  const contract = await EvidenceVault.deploy();
  await contract.deployed();
  console.log("EvidenceVault deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
