import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Signer } from "ethers";
import { MockErc20, SonovaACSContract } from "../typechain-types";

describe("NuushiNFT", function () {
  let SonovaACS: SonovaACSContract;
  let MockPaymentToken: MockErc20;
  let owner: Signer;
  let minter: Signer;
  let addr2: Signer;

  const baseTokenURI =
    "ipfs:/bafkreicmhkxixbihhywewbvob63us56fsmpwd6cw7sv7gx3hkilv6yroli";

  beforeEach(async function () {
    [owner, minter, addr2] = await hre.ethers.getSigners();

    const MockErc20Factory = await hre.ethers.getContractFactory("MockErc20");

    MockPaymentToken = await MockErc20Factory.deploy("MockErc20", "MERC");

    await MockPaymentToken.mint(
      await minter.getAddress(),
      ethers.parseEther("1000000")
    );

    const SonovaACSFactory = await hre.ethers.getContractFactory(
      "SonovaACSContract"
    );

    SonovaACS = await SonovaACSFactory.deploy(
      baseTokenURI,
      await MockPaymentToken.getAddress()
    );
  });

  it("Should deploy the contract & check balance", async function () {
    expect(await SonovaACS.name()).to.equal("Sonova ACS edition");
    expect(await SonovaACS.symbol()).to.equal("SACSE");

    expect(
      await MockPaymentToken.balanceOf(await minter.getAddress())
    ).to.equal(ethers.parseEther("1000000"));
  });

  it("Should set the start and end timestamp", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await SonovaACS.setStartTimestamp(currentBlockTime - 1);
    await SonovaACS.setEndTimestamp(currentBlockTime + 5);

    expect(await SonovaACS.startTimestamp()).to.equal(currentBlockTime - 1);

    expect(await SonovaACS.endTimestamp()).to.equal(currentBlockTime + 5);
  });

  it("Should mint NFTs within the sale period", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await SonovaACS.setStartTimestamp(currentBlockTime - 1);
    await SonovaACS.setEndTimestamp(currentBlockTime + 5);

    // should approve the contract to spend the token first
    await MockPaymentToken.connect(minter).approve(
      await SonovaACS.getAddress(),
      ethers.parseEther("10")
    );
    await SonovaACS.connect(minter).mint();
    expect(await SonovaACS.totalSupply()).to.equal(1);

    // expect the balance of the minter to be reduced
    expect(
      await MockPaymentToken.balanceOf(await minter.getAddress())
    ).to.equal(ethers.parseEther("999990"));
  });

  it("Should block mint NFTs due to sale has not started", async function () {
    // await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    // await hre.ethers.provider.send("evm_mine", []);
    await expect(SonovaACS.connect(minter).mint()).to.be.revertedWith(
      "Sale has not started"
    );
  });

  it(" Should block mint NFTs Sale has ended", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await SonovaACS.setStartTimestamp(currentBlockTime - 1);
    await SonovaACS.setEndTimestamp(currentBlockTime + 5);
    await hre.ethers.provider.send("evm_increaseTime", [10]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await expect(SonovaACS.connect(minter).mint()).to.be.revertedWith(
      "Sale has ended"
    );
  });

  it("Should get token URI", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await SonovaACS.setStartTimestamp(currentBlockTime - 1);
    await SonovaACS.setEndTimestamp(currentBlockTime + 5);

    // should approve the contract to spend the token first
    await MockPaymentToken.connect(minter).approve(
      await SonovaACS.getAddress(),
      ethers.parseEther("10")
    );
    await SonovaACS.connect(minter).mint();
    expect(await SonovaACS.tokenURI(1)).to.be.equal(baseTokenURI);
  });

  it("Should get minted count", async function () {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await SonovaACS.setStartTimestamp(currentBlockTime - 1);
    await SonovaACS.setEndTimestamp(currentBlockTime + 5);

    // should approve the contract to spend the token first
    await MockPaymentToken.connect(minter).approve(
      await SonovaACS.getAddress(),
      ethers.parseEther("10")
    );
    await SonovaACS.connect(minter).mint();

    expect(await SonovaACS.mintedCount(await minter.getAddress())).to.be.equal(
      1
    );
  });

  it("Should withdraw the token by owner after mint", async function () {
    // set the start and end timestamp
    const block = await hre.ethers.provider.getBlock("latest");
    const currentBlockTime = block?.timestamp!;
    await SonovaACS.setStartTimestamp(currentBlockTime - 1);
    await SonovaACS.setEndTimestamp(currentBlockTime + 5);

    // should approve the contract to spend the token first
    await MockPaymentToken.connect(minter).approve(
      await SonovaACS.getAddress(),
      ethers.parseEther("10")
    );
    await SonovaACS.connect(minter).mint();

    await SonovaACS.connect(owner).withdrawToken();

    expect(
      await MockPaymentToken.balanceOf(await owner.getAddress())
    ).to.be.equal(ethers.parseEther("10"));
  });

  /// need to change the max supply to 1 in contract
  // it("Should reach limit if the token MAX_SUPPLY = 1 ", async function () {
  //   // set the start and end timestamp
  //   const block = await hre.ethers.provider.getBlock("latest");
  //   const currentBlockTime = block?.timestamp!;
  //   await SonovaACS.setStartTimestamp(currentBlockTime - 1);
  //   await SonovaACS.setEndTimestamp(currentBlockTime + 10);

  //   // 1st
  //   // should approve the contract to spend the token first
  //   await MockPaymentToken.connect(minter).approve(
  //     await SonovaACS.getAddress(),
  //     ethers.parseEther("10")
  //   );
  //   await SonovaACS.connect(minter).mint();

  //   // 2nd mint should reach the limit
  //   // should approve the contract to spend the token first
  //   await MockPaymentToken.connect(minter).approve(
  //     await SonovaACS.getAddress(),
  //     ethers.parseEther("10")
  //   );

  //   await expect(SonovaACS.connect(minter).mint()).to.be.revertedWith(
  //     "Max supply reached"
  //   );
  // });
});
