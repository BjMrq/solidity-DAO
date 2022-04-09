import { assert, expect } from "chai"
import { deployments, ethers } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { AstroToken, AstroTokenSale } from "../typechain-types"

describe("Deployment supply state", () => {
  let AstroToken: AstroToken

  beforeEach(async () => {
    await deployments.fixture(["sales", "stake"])

    AstroToken = await ethers.getContract<AstroToken>("AstroToken")
  })

  it("AstroToken is deployed with the correct initial supply", async () => {
    const totalSupply = await AstroToken.totalSupply()

    expect(totalSupply).to.equal(toSmallestUnit("100000000000"))
  })

  it("Sale contract is deployed with half Astro token supply", async () => {
    const AstroTokenSale = await ethers.getContract<AstroTokenSale>("AstroTokenSale")

    const saleContractBalance = await AstroToken.balanceOf(AstroTokenSale.address)

    expect(saleContractBalance).to.equal(toSmallestUnit("5000000"))
  })

  it("Sale contract is deployed with half Astro token supply", async () => {
    const AstroStake = await ethers.getContract<AstroTokenSale>("AstroStake")

    const saleContractBalance = await AstroToken.balanceOf(AstroStake.address)

    expect(saleContractBalance).to.equal(toSmallestUnit("5000000"))
  })
})
