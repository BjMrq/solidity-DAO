import { deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import { ColorBox } from "../../typechain-types"

describe("Governor Flow", async () => {
  let box: ColorBox

  beforeEach(async () => {
    await deployments.fixture(["governance"])

    box = await ethers.getContract<ColorBox>("ColorBox")
  })

  it("can only be changed through governance", async () => {
    await expect(box.changeColor("#ffff")).to.be.revertedWith("Ownable: caller is not the owner")
  })
})
