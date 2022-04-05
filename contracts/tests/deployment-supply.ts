import { assert, expect } from "chai"
import { deployments, ethers } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { SatiToken, SatiTokenSale } from "../typechain-types"

describe("Deployment supply state", () => {
  let SatiToken: SatiToken

  beforeEach(async () => {
    await deployments.fixture(["sales"])

    SatiToken = await ethers.getContract<SatiToken>("SatiToken")
  })

  it("SatiToken is deployed with the correct initial supply", async () => {
    const totalSupply = await SatiToken.totalSupply()

    expect(totalSupply).to.equal(toSmallestUnit("1000000000"))
  })

  it("Sale contract is deployed with half Sati token supply", async () => {
    const SatiTokenSale = await ethers.getContract<SatiTokenSale>("SatiTokenSale")

    const saleContractBalance = await SatiToken.balanceOf(SatiTokenSale.address)

    expect(saleContractBalance).to.equal(toSmallestUnit("5000000"))
  })
})
