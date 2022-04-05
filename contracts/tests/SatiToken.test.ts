import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { foundAddressWith } from "../helpers/tokens/founding"
import { NamedAddresses, NamedSigners } from "../helpers/types"
import { SatiToken } from "../typechain-types"

describe("SatiToken", () => {
  let SatiToken: SatiToken
  let namedAccounts: NamedAddresses
  let namedSigners: NamedSigners

  beforeEach(async () => {
    await deployments.fixture(["SatiToken"])

    namedAccounts = (await getNamedAccounts()) as NamedAddresses
    namedSigners = (await ethers.getNamedSigners()) as NamedSigners

    SatiToken = await ethers.getContract<SatiToken>("SatiToken")
  })

  it("Is possible to send token between accounts", async () => {
    const amount = 1

    await SatiToken.transfer(namedAccounts.satiReceiver, amount)

    const receiverBalance = await SatiToken.balanceOf(namedAccounts.satiReceiver)

    expect(receiverBalance).to.equal("1")
  })

  it("Is not possible to send more tokens then the amount hold by an account", async () => {
    await foundAddressWith(SatiToken, {
      addressToFound: namedAccounts.satiSender,
      amount: 1,
    })

    await expect(
      SatiToken.connect(namedSigners.satiSender).transfer(namedAccounts.satiReceiver, 2)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

    const senderAccountBalance = await SatiToken.balanceOf(namedAccounts.satiSender)

    const receiverAccountBalance = await SatiToken.balanceOf(namedAccounts.satiReceiver)

    expect(senderAccountBalance).to.equal("1")
    expect(receiverAccountBalance).to.equal("0")
  })

  it("Is not possible to send more token than total available supply", async () => {
    await expect(
      SatiToken.transfer(namedAccounts.satiReceiver, "1000000000000000000000000001")
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

    const receiverAccountBalance = await SatiToken.balanceOf(namedAccounts.satiReceiver)

    expect(receiverAccountBalance).to.equal("0")
  })
})
