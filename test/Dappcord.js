const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let dappcord;
  let NAME = "Dappcord";
  let SYMBOL = "DC";
  let deployer;
  let user;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();

    let Dappcord = await ethers.getContractFactory("Dappcord");
    dappcord = await Dappcord.deploy(NAME, SYMBOL);
    await dappcord.deployed();

    let trans = await dappcord.connect(deployer).createChannel("general", tokens(1));
    await trans.wait();

  })

  describe("Deployment", async () => {

    it("Should get name", async () => {
      let result = await dappcord.name();
      expect(result).to.be.equal(NAME)
    })
    it("Should get symbol", async () => {
      let result = await dappcord.symbol();
      expect(result).to.be.equal(SYMBOL)
    })

    it("Should set owner", async () => {
      let result = await dappcord.owner();
      expect(result).to.be.equal(deployer.address);
    })

  })

  describe("Creating Channel", async () => {

    it("Should increase total channel count", async () => {
      let result = await dappcord.channelId();
      expect(result).to.equal(1);

    })
    it("Should return channel attribute", async () => {
      let result = await dappcord.getChannel(1);
      expect(result.name).to.be.equal("general")
      expect(result.id).to.be.equal(1)
      expect(result.cost).to.be.equal(tokens(1))
    })
  })



  describe("Minting and joining", async () => {
    let ID = 1;
    let AMOUNT = tokens(1);
    
    beforeEach(async () => {
      let trans = await dappcord.connect(user).mint(ID, { value: AMOUNT });
      await trans.wait();
    })
    
    it("join the user", async () => {
      let result = await dappcord.hasJoined(ID, user.address);
      expect(result).to.equal(true);
    })

    it("increase totalSupply", async () => {
      let result = await dappcord.totalSupply();
      expect(result).to.equal(ID);
    })

    it("increase contract balance", async () => {
      let result = await ethers.provider.getBalance(dappcord.address);
      expect(result).to.equal(AMOUNT);
    })
  })

  describe("Withdrawing",async()=>{
    let ID = 1;
    let AMOUNT = ethers.utils.parseUnits("10", 'ether');
    let beforeBalance;

     beforeEach(async () => {
      beforeBalance = await ethers.provider.getBalance(deployer.address)

      let trans = await dappcord.connect(user).mint(ID,{value:AMOUNT});
      await trans.wait();

      trans = await dappcord.connect(deployer).withdraw();
      await trans.wait();
    })

    it("should update contract balance",async()=>{
      let result  = await ethers.provider.getBalance(dappcord.address);
      expect(result).to.be.equal(0);
    })
    it("should check owner balance",async()=>{
      let afterBalance  = await ethers.provider.getBalance(deployer.address);
      expect(afterBalance).to.greaterThan(beforeBalance);
      
    })

  })


})
