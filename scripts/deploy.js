const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  
  console.log("Deploying Oracle...");
  const oracle = await Oracle.deploy();
  
  await oracle.deployed();
  console.log("Oracle deployed to:", oracle.address);

  console.log("Setting oracleAddress to Oracle's own address...");
  const tx = await oracle.setOracleAddress(oracle.address);
  await tx.wait();
  console.log("oracleAddress set to:", oracle.address);

  const artifact = await hre.artifacts.readArtifact("Oracle");
  
  const abiDir = path.join(__dirname, "../abi");
  
  if (!fs.existsSync(abiDir)){
    fs.mkdirSync(abiDir);
    console.log(`Created ABI directory at ${abiDir}`);
  }
  
  const abiPath = path.join(abiDir, "Oracle.json");
  
  // 将 ABI 写入到 abi/Oracle.json 文件中
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
  console.log(`ABI written to ${abiPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
