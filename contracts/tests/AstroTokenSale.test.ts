import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { NamedAddresses, NamedSigners } from "../helpers/types"
import { AstroToken, AstroTokenSale } from "../typechain-types"

describe("AstroTokenSale", () => {
  let AstroToken: AstroToken
  let AstroTokenSale: AstroTokenSale
  let namedAccounts: NamedAddresses
  let namedSigners: NamedSigners

  beforeEach(async () => {
    await deployments.fixture(["sales"])

    AstroToken = await ethers.getContract<AstroToken>("AstroToken")
    AstroTokenSale = await ethers.getContract<AstroTokenSale>("AstroTokenSale")

    namedAccounts = (await getNamedAccounts()) as NamedAddresses
    namedSigners = (await ethers.getNamedSigners()) as NamedSigners
  })

  // it("Buyers need to complete KYC verification", async () => {
  //   const AstroToken = await AstroToken.deployed();
  //   const deployedAstroTokenSalesInstance = await AstroTokenSale.deployed();

  //   try {
  //     await deployedAstroTokenSalesInstance.buyTokens(saleBuyerAccount, {
  //       value: "100",
  //     });
  //   } catch (error) {
  //     assert.equal(
  //       (error as Error).message,
  //       "Returned error: VM Exception while processing transaction: revert You must complete KYC before purchasing tokens -- Reason given: You must complete KYC before purchasing tokens."
  //     );
  //   }

  //   const buyerBalance = await AstroToken.balanceOf(
  //     saleBuyerAccount
  //   );

  //   assert.equal(buyerBalance.toString(), "0");
  // });

  // it("Buyers need to have enough Ether to buy Astro", async () => {
  //   await expect(
  //     AstroTokenSale.connect(namedSigners.astroBuyer).buyTokens(namedAccounts.astroBuyer, {
  //       value: toSmallestUnit(10001, { hexlify: true }),
  //     })
  //     // Not that this is a hardhat throw error and not a revert from contract since hardhat does not allow sending transaction that is higher that the balance
  //   ).to.be.revertedWith(
  //     "InvalidInputError: sender doesn't have enough funds to send tx. The max upfront cost is: 10001029417623067345120 and the sender's account only has: 10000000000000000000000"
  //   )

  //   const buyerBalance = await AstroToken.balanceOf(namedAccounts.astroBuyer)

  //   assert.equal(buyerBalance.toString(), "0")
  // })

  it("Sale can distribute token to buyers", async () => {
    await AstroTokenSale.connect(namedSigners.astroBuyer).buyTokens(namedAccounts.astroBuyer, {
      value: toSmallestUnit("0.01"),
    })

    const buyerBalance = await AstroToken.balanceOf(namedAccounts.astroBuyer)

    expect(buyerBalance).to.equal(toSmallestUnit(30))
  })
})
