import { expect } from "chai"
import { BigNumber } from "ethers"
import { deployments, ethers } from "hardhat"
import { foundAddressWith } from "../helpers/tokens/founding"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { NamedSigners } from "../helpers/types"
import { SwapContractFactory, ERC20, ERC20TokensSwap } from "../typechain-types"

describe("ERC20TokensSwap", () => {
  let ERC20TokensSwap: ERC20TokensSwap
  let BaseToken: ERC20
  let QuoteToken: ERC20
  let SwapContractFactory: SwapContractFactory
  let namedSigners: NamedSigners
  const swapRate = 0.8

  beforeEach(async () => {
    await deployments.fixture(["sales"])

    namedSigners = (await ethers.getNamedSigners()) as NamedSigners

    SwapContractFactory = await ethers.getContract<SwapContractFactory>("SwapContractFactory")

    const allSwapPairName = await SwapContractFactory.getAllSwapPairs()

    const { swapContractAddress, quoteTokenAddress, baseTokenAddress } =
      await SwapContractFactory.deployedSwapContractsRegistry(allSwapPairName[0])

    BaseToken = await ethers.getContractAt<ERC20>("ERC20", baseTokenAddress)
    QuoteToken = await ethers.getContractAt<ERC20>("ERC20", quoteTokenAddress)
    ERC20TokensSwap = await ethers.getContractAt<ERC20TokensSwap>(
      "ERC20TokensSwap",
      swapContractAddress
    )

    // initialQuoteTokenPoolSupply = await ERC20TokensSwap.getAvailableQuoteTokenLiquidity()
    // initialBaseTokenPoolSupply = await ERC20TokensSwap.getAvailableBaseTokenLiquidity()

    ////@ts-expect-error possibly undefined values
    // swapRate = (
    //   await await withAwaitConfirmation(ERC20TokensSwap.getScaledRate("8"))
    // ).events[0].args.scaledPrice.toString()
  })

  // it("Can not swap ERC20 Token for Astro if there is no more Astro in the contract", async () => {

  //TODO with fresh controlled contracts

  //   const ERC20TokenAmountToEmptySupply = toUnit(
  //     Number(initialSwapTestAstroSupply) / supposedRate
  //   )

  //   const emptyAstroReserve = async () => {
  //     await BaseToken.approve(ERC20TokensSwap.address, ERC20TokenAmountToEmptySupply, {
  //       from: swapastroBuyerAccount,
  //     })

  //     await ERC20TokensSwap.swapBaseForQuoteToken(ERC20TokenAmountToEmptySupply, {
  //       from: swapastroBuyerAccount,
  //     })
  //   }

  //   await foundAddressWith(BaseToken, {
  //     addressToFound: swapastroBuyerAccount,
  //     amount: toUnit("1000"),
  //   })

  //   await emptyAstroReserve()

  //   await BaseToken.approve(ERC20TokensSwap.address, toUnit("1"), {
  //     from: swapastroBuyerAccount,
  //   })

  //   try {
  //     await ERC20TokensSwap.swapBaseForQuoteToken(toUnit("1"), {
  //       from: swapastroBuyerAccount,
  //     })
  //   } catch (error) {
  //     expect((error as Error).message).equal(
  //       "Returned error: VM Exception while processing transaction: revert Not enough ASTRO -- Reason given: Not enough ASTRO."
  //     )
  //   }
  // })

  it("swapBaseForQuoteToken transfer appropriate quote token amount", async () => {
    const pairedTokenToSwap = toSmallestUnit("1")
    const supposedQuoteTokenAmount = toSmallestUnit(1 * swapRate)

    await foundAddressWith(BaseToken, {
      addressToFound: namedSigners.astroBuyer.address,
      amount: pairedTokenToSwap,
    })

    await BaseToken.connect(namedSigners.astroBuyer).approve(
      ERC20TokensSwap.address,
      pairedTokenToSwap
    )

    const buyerQuoteTokenBalanceBefore = await QuoteToken.balanceOf(namedSigners.astroBuyer.address)
    const swapContractQuoteTokenBalanceBefore = await QuoteToken.balanceOf(ERC20TokensSwap.address)

    await ERC20TokensSwap.connect(namedSigners.astroBuyer).swapBaseForQuoteToken(pairedTokenToSwap)

    const buyerQuoteTokenBalanceAfter = await QuoteToken.balanceOf(namedSigners.astroBuyer.address)
    const swapContractQuoteTokenBalanceAfter = await QuoteToken.balanceOf(ERC20TokensSwap.address)

    expect(buyerQuoteTokenBalanceBefore).equal(0)
    expect(buyerQuoteTokenBalanceAfter).equal(supposedQuoteTokenAmount)
    expect(swapContractQuoteTokenBalanceBefore.sub(swapContractQuoteTokenBalanceAfter)).equal(
      supposedQuoteTokenAmount
    )
  })

  it("swapBaseForQuoteToken transfer appropriate base token amount", async () => {
    const pairedTokenToSwap = toSmallestUnit("1")

    await foundAddressWith(BaseToken, {
      addressToFound: namedSigners.astroBuyer.address,
      amount: pairedTokenToSwap,
    })

    await BaseToken.connect(namedSigners.astroBuyer).approve(
      ERC20TokensSwap.address,
      pairedTokenToSwap
    )

    const swapContractBaseTokenBalanceBefore = await BaseToken.balanceOf(ERC20TokensSwap.address)

    await ERC20TokensSwap.connect(namedSigners.astroBuyer).swapBaseForQuoteToken(pairedTokenToSwap)

    const buyerBaseTokenBalanceAfter = await BaseToken.balanceOf(namedSigners.astroBuyer.address)
    const swapContractBaseTokenBalanceAfter = await BaseToken.balanceOf(ERC20TokensSwap.address)

    expect(buyerBaseTokenBalanceAfter).equal("0")
    expect(swapContractBaseTokenBalanceAfter).equal(
      swapContractBaseTokenBalanceBefore.add(pairedTokenToSwap)
    )
  })

  it("swapQuoteForBaseToken transfer appropriate quote token amount", async () => {
    const pairedTokenToSwap = toSmallestUnit("1")

    await foundAddressWith(QuoteToken, {
      addressToFound: namedSigners.astroSeller.address,
      amount: pairedTokenToSwap,
    })

    await QuoteToken.connect(namedSigners.astroSeller).approve(
      ERC20TokensSwap.address,
      pairedTokenToSwap
    )

    const buyerQuoteTokenBalanceBefore = await QuoteToken.balanceOf(
      namedSigners.astroSeller.address
    )
    const swapContractQuoteTokenBalanceBefore = await QuoteToken.balanceOf(ERC20TokensSwap.address)

    await ERC20TokensSwap.connect(namedSigners.astroSeller).swapQuoteForBaseToken(pairedTokenToSwap)

    const buyerQuoteTokenBalanceAfter = await QuoteToken.balanceOf(namedSigners.astroSeller.address)
    const swapContractQuoteTokenBalanceAfter = await QuoteToken.balanceOf(ERC20TokensSwap.address)

    expect(buyerQuoteTokenBalanceBefore).equal(pairedTokenToSwap)
    expect(buyerQuoteTokenBalanceAfter).equal("0")
    expect(swapContractQuoteTokenBalanceAfter.sub(swapContractQuoteTokenBalanceBefore)).equal(
      pairedTokenToSwap
    )
  })

  it("swapQuoteForBaseToken transfer appropriate base token amount", async () => {
    const pairedTokenToSwap = toSmallestUnit("1")
    const supposedBaseTokenAmount = toSmallestUnit(1 / swapRate)

    await foundAddressWith(QuoteToken, {
      addressToFound: namedSigners.astroSeller.address,
      amount: pairedTokenToSwap,
    })

    await QuoteToken.connect(namedSigners.astroSeller).approve(
      ERC20TokensSwap.address,
      pairedTokenToSwap
    )

    const swapContractBaseTokenBalanceBefore = await BaseToken.balanceOf(ERC20TokensSwap.address)

    await ERC20TokensSwap.connect(namedSigners.astroSeller).swapQuoteForBaseToken(pairedTokenToSwap)

    const buyerBaseTokenBalanceAfter = await BaseToken.balanceOf(namedSigners.astroSeller.address)
    const swapContractBaseTokenBalanceAfter = await BaseToken.balanceOf(ERC20TokensSwap.address)

    expect(buyerBaseTokenBalanceAfter).equal(supposedBaseTokenAmount)
    expect(swapContractBaseTokenBalanceAfter).equal(
      swapContractBaseTokenBalanceBefore.sub(supposedBaseTokenAmount)
    )
  })

  it("Emit an event with swap info when swapping ERC20Token for astro", async () => {
    await foundAddressWith(BaseToken, {
      addressToFound: namedSigners.astroBuyer.address,
      amount: toSmallestUnit("1"),
    })

    await BaseToken.connect(namedSigners.astroBuyer).approve(
      ERC20TokensSwap.address,
      toSmallestUnit("1")
    )

    await expect(
      ERC20TokensSwap.connect(namedSigners.astroBuyer).swapBaseForQuoteToken(toSmallestUnit("1"), {
        value: toSmallestUnit("1"),
      })
    )
      .to.emit(ERC20TokensSwap, "Rate")
      .withArgs(toSmallestUnit(swapRate), "1")

      .to.emit(ERC20TokensSwap, "SwapTransferInfo")
      .withArgs(
        "0x5ba160db5Ef663c68E0227b41550F471F70aDde3",
        toSmallestUnit(1),
        toSmallestUnit(swapRate)
      )
  })

  it("Can not swap astro for ERC20 Token if buyer does not have enough astro", async () => {
    await expect(
      ERC20TokensSwap.connect(namedSigners.astroBuyer).swapQuoteForBaseToken(toSmallestUnit("100"))
    ).to.revertedWith("reverted with reason string 'Not enough ASTRO")
  })
})
