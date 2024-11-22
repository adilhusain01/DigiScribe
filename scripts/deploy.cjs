const hre = require('hardhat');

async function main() {
  try {
    // Get the contract factory
    const DigiScribe = await hre.ethers.getContractFactory(
      'DigiScribe'
    );

    const rewardTokenAddress = '0x8424B3E40C4c4280ad82Bc3d056abc924DF99e8D';
    // Deploy the contract
    console.log('Deploying DigiScribe contract...');
    const digiScribe = await DigiScribe.deploy(rewardTokenAddress);

    // Wait for deployment to finish
    const contractAddress = await digiScribe.address;

    console.log('DigiScribe contract deployed to:', contractAddress);
    console.log('Save this address for interaction script!');
  } catch (error) {
    console.error('Error during deployment:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
