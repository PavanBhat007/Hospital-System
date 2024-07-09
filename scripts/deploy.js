const hre = require('hardhat');

async function main() {
  const PatientRecords = await hre.ethers.getContractFactory("PatientRecords");
  const patientRecords = await PatientRecords.deploy();

  await patientRecords.deployed();

  console.log("Library deployed to:", patientRecords.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});