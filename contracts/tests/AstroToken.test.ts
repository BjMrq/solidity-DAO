import { expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { foundAddressWith } from "../helpers/tokens/founding"
import { NamedAddresses, NamedSigners } from "../helpers/types"
import { AstroToken } from "../typechain-types"

describe("AstroToken", () => {
  let AstroToken: AstroToken
  let namedAccounts: NamedAddresses
  let namedSigners: NamedSigners

  beforeEach(async () => {
    await deployments.fixture(["AstroToken"])

    namedAccounts = (await getNamedAccounts()) as NamedAddresses
    namedSigners = (await ethers.getNamedSigners()) as NamedSigners

    AstroToken = await ethers.getContract<AstroToken>("AstroToken")
  })

  it("Is possible to send token between accounts", async () => {
    const amount = 1

    await AstroToken.transfer(namedAccounts.astroReceiver, amount)

    const receiverBalance = await AstroToken.balanceOf(namedAccounts.astroReceiver)

    expect(receiverBalance).to.equal("1")
  })

  it("Is not possible to send more tokens then the amount hold by an account", async () => {
    await foundAddressWith(AstroToken, {
      addressToFound: namedAccounts.astroSender,
      amount: 1,
    })

    await expect(
      AstroToken.connect(namedSigners.astroSender).transfer(namedAccounts.astroReceiver, 2)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

    const senderAccountBalance = await AstroToken.balanceOf(namedAccounts.astroSender)

    const receiverAccountBalance = await AstroToken.balanceOf(namedAccounts.astroReceiver)

    expect(senderAccountBalance).to.equal("1")
    expect(receiverAccountBalance).to.equal("0")
  })

  it("Is not possible to send more token than total available supply", async () => {
    await expect(
      AstroToken.transfer(namedAccounts.astroReceiver, "100000000000000000000000000001")
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

    const receiverAccountBalance = await AstroToken.balanceOf(namedAccounts.astroReceiver)

    expect(receiverAccountBalance).to.equal("0")
  })
})
