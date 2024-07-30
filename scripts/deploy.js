const hre = require("hardhat")

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const NAME = "Dappcord";
  const SYMBOL = "DC";

  let Dappcord = await hre.ethers.getContractFactory("Dappcord");
  let dappcord = await Dappcord.deploy(NAME,SYMBOL);
  await dappcord.deployed();

  console.log("Contract deployed at ",dappcord.address);

  let name = ["general","jobs","sports"];
  let cost = [tokens(1),tokens(0),tokens(0.5)];

  for(let i=0; i<3; i++){
    let trans = await dappcord.connect(deployer).createChannel(name[i],cost[i]);
    await trans.wait();

    console.log("Created channel #",name[i]);
  }


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});