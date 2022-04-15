import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { ethers } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { Faucet, FaucetReentrancyAttacker__factory } from "../typechain-types"
import { deployNewContract } from "./utils/deploy-new"

const fundFaucet = async (faucetProvider: Signer, faucetInstanceAddress: string) =>
  await faucetProvider.sendTransaction({
    to: faucetInstanceAddress,
    value: toSmallestUnit("1", { hexlify: true }),
  })

describe("Faucet", () => {
  let faucetFounder: SignerWithAddress
  let faucetUser: SignerWithAddress
  let deployer: SignerWithAddress
  let Faucet: Faucet

  beforeEach(async () => {
    faucetFounder = await ethers.getNamedSigner("faucetFounder")
    faucetUser = await ethers.getNamedSigner("faucetFounder")
    deployer = await ethers.getNamedSigner("deployer")

    Faucet = await deployNewContract("Faucet")

    await fundFaucet(faucetFounder, Faucet.address)
  })

  it("Can receive eth to be distributed", async () => {
    const faucetSupply = await ethers.provider.getBalance(Faucet.address)

    expect(faucetSupply).to.equal(toSmallestUnit("1"))
  })

  it("Can distribute ether minus gas fee", async () => {
    const gasFee = (await Faucet.estimateGas.makeItRain()).toString()

    const balanceBefore = await ethers.provider.getBalance(faucetUser.address)

    await Faucet.connect(faucetUser).makeItRain()

    const balanceAfter = await ethers.provider.getBalance(faucetUser.address)

    const distributedAmount = balanceAfter.sub(balanceBefore).sub(gasFee)

    expect(distributedAmount.toString().length).equal(16)
    expect(distributedAmount.toString().startsWith("99")).equal(true)
  })

  it("Is not vulnerable to reentrancy attacks", async () => {
    const FaucetReentrancyAttackerFactory =
      await ethers.getContractFactory<FaucetReentrancyAttacker__factory>("FaucetReentrancyAttacker")

    const FaucetReentrancyAttacker = await FaucetReentrancyAttackerFactory.deploy(Faucet.address)

    await expect(FaucetReentrancyAttacker.connect(deployer).attack()).to.be.revertedWith(
      "Transfer failed."
    )

    const faucetBalanceAfterAttack = await ethers.provider.getBalance(Faucet.address)

    expect(faucetBalanceAfterAttack).to.not.equal("0")
  })

  // it("Does not send ether to addresses with lot of ether", async () => {
  //   const faucetInstance = await Faucet.new()

  //   await fundFaucet(faucetProviderAccount, faucetInstance.address)

  //   try {
  //     await faucetInstance.makeItRain({
  //       from: faucetProviderAccount,
  //     })
  //   } catch (error) {
  //     expect((error as Error).message).to.equal("revert")
  //   }
  // })
})
