import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20 } from "../typechain";

describe("ERC20Contract", () => {
  let erc20Contract: ERC20;
  let someAddress: SignerWithAddress;
  let someOtherAddress: SignerWithAddress;

  beforeEach(async () => {
    const ERC20ContractFactory = await ethers.getContractFactory("ERC20");
    erc20Contract = await ERC20ContractFactory.deploy("CRP", "CRP20");
    await erc20Contract.deployed();
    someAddress = (await ethers.getSigners())[1];
    someOtherAddress = (await ethers.getSigners())[2];
  });

  describe("When I have 10 tokens", () => {
    beforeEach(async () => {
      await erc20Contract.transfer(someAddress.address, 10);
    });

    describe("When I transfer 10 tokens", () => {
      it("Should trasnfer successfully", async () => {
        await erc20Contract
          .connect(someAddress)
          .transfer(someOtherAddress.address, 10);
        expect(
          await erc20Contract.balanceOf(someOtherAddress.address)
        ).to.equal(10);
      });
    });

    describe("When I transfer 15 tokens", () => {
      it("Should revert the transaction", async () => {
        await expect(
          erc20Contract
            .connect(someAddress)
            .transfer(someOtherAddress.address, 15)
        ).to.be.revertedWith("Amount exceeds sender available balance");
      });
    });
  });
});
