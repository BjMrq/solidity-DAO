import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Signer } from "ethers"
import { deployments, ethers } from "hardhat"
import { moveChainTimeFor } from "../helpers/chain/move-blocks"
import { foundAddressWith } from "../helpers/tokens/founding"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { NamedSigners } from "../helpers/types"
import { AstroStake, AstroToken, Faucet } from "../typechain-types"

describe("AstroStake", () => {
  let AstroToken: AstroToken
  let AstroStake: AstroStake
  let namedSigners: NamedSigners

  beforeEach(async () => {
    await deployments.fixture(["stake"])

    namedSigners = (await ethers.getNamedSigners()) as NamedSigners

    AstroToken = await ethers.getContract<AstroToken>("AstroToken")
    AstroStake = await ethers.getContract<AstroStake>("AstroStake")
  })

  const buyAndStakeTokens = async (
    staker: SignerWithAddress,
    numberOfTokenToBuyAndStake: string
  ) => {
    await foundAddressWith(AstroToken, {
      addressToFound: staker.address,
      amount: numberOfTokenToBuyAndStake,
    })

    await AstroToken.connect(staker).approve(AstroStake.address, numberOfTokenToBuyAndStake)

    await AstroStake.connect(staker).stakeTokens(numberOfTokenToBuyAndStake)
  }

  it("Staking tokens are removed from user balance", async () => {
    const astroTokensToStake = toSmallestUnit("100")

    await foundAddressWith(AstroToken, {
      addressToFound: namedSigners.astroBuyer.address,
      amount: astroTokensToStake,
    })

    const connectedToBuyerAstroToken = await AstroToken.connect(namedSigners.astroBuyer)

    const balanceBeforeStaking = await connectedToBuyerAstroToken.balanceOf(
      namedSigners.astroBuyer.address
    )

    await connectedToBuyerAstroToken.approve(AstroStake.address, astroTokensToStake)

    await AstroStake.connect(namedSigners.astroBuyer).stakeTokens(astroTokensToStake)

    const balanceAfterStaking = await connectedToBuyerAstroToken.balanceOf(
      namedSigners.astroBuyer.address
    )

    expect(balanceBeforeStaking).equal(astroTokensToStake)
    expect(balanceAfterStaking).equal(0)
  })

  it("You can not stake 0", async () => {
    await expect(AstroStake.connect(namedSigners.astroBuyer).stakeTokens("0")).to.be.revertedWith(
      "staking amount required"
    )
  })

  it("You can only un stake if you have staked", async () => {
    await expect(AstroStake.connect(namedSigners.astroBuyer).unStakeTokens()).to.be.revertedWith(
      "not staking"
    )
  })

  it("You can only un stake after lock time", async () => {
    const astroTokensToStake = toSmallestUnit("100")

    await buyAndStakeTokens(namedSigners.astroBuyer, astroTokensToStake)

    await expect(AstroStake.connect(namedSigners.astroBuyer).unStakeTokens()).to.be.revertedWith(
      "lock time has not expired"
    )
  })

  it("You can only un have one staking", async () => {
    const astroTokensToStake = toSmallestUnit("100")

    await buyAndStakeTokens(namedSigners.astroBuyer, astroTokensToStake)

    await foundAddressWith(AstroToken, {
      addressToFound: namedSigners.astroBuyer.address,
      amount: astroTokensToStake,
    })

    await AstroToken.connect(namedSigners.astroBuyer).approve(
      AstroStake.address,
      astroTokensToStake
    )

    await expect(
      AstroStake.connect(namedSigners.astroBuyer).stakeTokens(astroTokensToStake)
    ).to.be.revertedWith("already staking")
  })

  it("You get your tokens back and interest when un staking", async () => {
    const astroTokensToStake = toSmallestUnit("100")

    await buyAndStakeTokens(namedSigners.astroBuyer, astroTokensToStake)

    await moveChainTimeFor(6 * 24 * 60 * 60)

    await AstroStake.connect(namedSigners.astroBuyer).unStakeTokens()

    const balanceAfterStaking = await AstroToken.connect(namedSigners.astroBuyer).balanceOf(
      namedSigners.astroBuyer.address
    )

    expect(balanceAfterStaking).equal("100360000000000000000")
  })
})
