import { expect } from "chai";
import hre from "hardhat";
import { Signer } from "ethers";
import { AstarNFTCommon, AstarNFTRare } from "../typechain-types";

describe("NuushiNFT", function () {
  let AstarNFTCommon: AstarNFTCommon;
  let AstarNFTRare: AstarNFTRare;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    const AstarNFTCommonFactory = await hre.ethers.getContractFactory(
      "AstarNFTCommon"
    );
    AstarNFTCommon = await AstarNFTCommonFactory.deploy("https://example.com/");

    const AstarNFTRareFactory = await hre.ethers.getContractFactory(
      "AstarNFTRare"
    );
    AstarNFTRare = await AstarNFTRareFactory.deploy("https://example.com/");
  });

  it("Should deploy the contract", async function () {
    expect(await AstarNFTCommon.name()).to.equal(
      "Astar Expansion: Soneium Edition - Common"
    );
    expect(await AstarNFTCommon.symbol()).to.equal("AESEC");

    expect(await AstarNFTRare.name()).to.equal(
      "Astar Expansion: Soneium Edition - Rare"
    );
    expect(await AstarNFTRare.symbol()).to.equal("AESER");
  });

  it("COMMON: Should set the start and end timestamp", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);

    expect(await AstarNFTCommon.startTimestamp()).to.equal(
      currentBlockTime - 1
    );

    expect(await AstarNFTCommon.endTimestamp()).to.equal(currentBlockTime + 5);
  });

  it("COMMON: Should mint NFTs within the sale period", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);

    await AstarNFTCommon.connect(addr1).mint();
    expect(await AstarNFTCommon.totalSupply()).to.equal(1);
  });

  it("COMMON: Should block mint NFTs due to one wallet one mint", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);

    await AstarNFTCommon.connect(addr1).mint();
    await expect(AstarNFTCommon.connect(addr1).mint()).to.be.revertedWith(
      "Max mint limit reached for wallet"
    );
  });

  it("COMMON: Should block mint NFTs due to sale has not started", async function () {
    // await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    // await hre.ethers.provider.send("evm_mine", []);
    await expect(AstarNFTCommon.connect(addr1).mint()).to.be.revertedWith(
      "Sale has not started"
    );
  });

  it("COMMON: Should block mint NFTs Sale has ended", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);
    await hre.ethers.provider.send("evm_increaseTime", [10]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await expect(AstarNFTCommon.connect(addr1).mint()).to.be.revertedWith(
      "Sale has ended"
    );
  });

  it("COMMON: Should get token URI", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);

    await AstarNFTCommon.connect(addr1).mint();
    expect(await AstarNFTCommon.tokenURI(1)).to.be.equal(
      "https://example.com/"
    );
  });

  it("COMMON: Should get minted count", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);
    await AstarNFTCommon.connect(addr1).mint();

    expect(
      await AstarNFTCommon.mintedCount(await addr1.getAddress())
    ).to.be.equal(1);
  });

  it("COMMON: Should change max mint per wallet", async function () {
    await AstarNFTCommon.setMaxMintPerWallet(2);
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await AstarNFTCommon.setStartTimestamp(currentBlockTime - 1);
    await AstarNFTCommon.setEndTimestamp(currentBlockTime + 5);
    await AstarNFTCommon.connect(addr1).mint();
    await AstarNFTCommon.connect(addr1).mint();

    expect(
      await AstarNFTCommon.mintedCount(await addr1.getAddress())
    ).to.be.equal(2);
  });

  it("RARE: Should get current sale day = 0", async function () {
    expect(await AstarNFTRare.getCurrentSaleDay()).to.be.equal(0);
  });

  it("RARE: Should get current sale day = 5", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    // day , start time, end time
    await AstarNFTRare.setSalePeriod(5, currentBlockTime, currentBlockTime + 5);

    expect(await AstarNFTRare.getCurrentSaleDay()).to.be.equal(5);
  });

  it("RARE: Should block mint => Not in sale period", async function () {
    await expect(AstarNFTRare.connect(addr1).mint()).to.be.revertedWith(
      "Not in sale period"
    );
  });

  // this one should change the contract MAX_MINT_PER_DAY to 1 then test
  // it("RARE: Should block mint => Daily mint limit reached", async function () {
  //   const block = await hre.ethers.provider.getBlock("latest");
  //   const currentBlockTime = block?.timestamp!;
  //   // day , start time, end time
  //   await AstarNFTRare.setSalePeriod(
  //     5,
  //     currentBlockTime,
  //     currentBlockTime + 300
  //   );

  //   await AstarNFTRare.connect(addr1).mint();

  //   await expect(AstarNFTRare.connect(addr2).mint()).to.be.revertedWith(
  //     "Daily mint limit reached"
  //   );
  // });

  it("RARE: Should block mint => Daily mint limit reached #1", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    // day , start time, end time
    await AstarNFTRare.setSalePeriod(
      5,
      currentBlockTime,
      currentBlockTime + 300
    );

    await AstarNFTRare.connect(addr1).mint();

    await expect(AstarNFTRare.connect(addr1).mint()).to.be.revertedWith(
      "Max mint limit reached for wallet"
    );
  });

  it("RARE: Should block mint => Daily mint limit reached #2", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    // day , start time, end time
    await AstarNFTRare.setSalePeriod(
      5,
      currentBlockTime,
      currentBlockTime + 300
    );

    await AstarNFTRare.connect(addr1).mint();

    await AstarNFTRare.setSalePeriod(
      1,
      currentBlockTime,
      currentBlockTime + 300
    );

    await expect(AstarNFTRare.connect(addr1).mint()).to.be.revertedWith(
      "Max mint limit reached for wallet"
    );
  });

  it("RARE: Should mint rare nft then check mint per wallet and mintedCount of period", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    // day , start time, end time
    await AstarNFTRare.setSalePeriod(
      5,
      currentBlockTime,
      currentBlockTime + 300
    );

    await AstarNFTRare.connect(addr1).mint();
    await AstarNFTRare.connect(addr2).mint();
    await AstarNFTRare.connect(owner).mint();

    expect(await AstarNFTRare.getMintedCount(5)).to.be.equal(3);
    expect(
      await AstarNFTRare.mintedCount(await addr1.getAddress())
    ).to.be.equal(1);
  });
});
