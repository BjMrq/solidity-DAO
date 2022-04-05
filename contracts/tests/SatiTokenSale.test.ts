import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { NamedAddresses, NamedSigners } from "../helpers/types"
import { SatiToken, SatiTokenSale } from "../typechain-types"

describe("SatiTokenSale", () => {
  let SatiToken: SatiToken
  let SatiTokenSale: SatiTokenSale
  let namedAccounts: NamedAddresses
  let namedSigners: NamedSigners

  beforeEach(async () => {
    await deployments.fixture(["sales"])

    SatiToken = await ethers.getContract<SatiToken>("SatiToken")
    SatiTokenSale = await ethers.getContract<SatiTokenSale>("SatiTokenSale")

    namedAccounts = (await getNamedAccounts()) as NamedAddresses
    namedSigners = (await ethers.getNamedSigners()) as NamedSigners
  })

  // it("Buyers need to complete KYC verification", async () => {
  //   const SatiToken = await SatiToken.deployed();
  //   const deployedSatiTokenSalesInstance = await SatiTokenSale.deployed();

  //   try {
  //     await deployedSatiTokenSalesInstance.buyTokens(saleBuyerAccount, {
  //       value: "100",
  //     });
  //   } catch (error) {
  //     assert.equal(
  //       (error as Error).message,
  //       "Returned error: VM Exception while processing transaction: revert You must complete KYC before purchasing tokens -- Reason given: You must complete KYC before purchasing tokens."
  //     );
  //   }

  //   const buyerBalance = await SatiToken.balanceOf(
  //     saleBuyerAccount
  //   );

  //   assert.equal(buyerBalance.toString(), "0");
  // });

  // it("Buyers need to have enough Ether to buy Sati", async () => {
  //   await expect(
  //     SatiTokenSale.connect(namedSigners.satiBuyer).buyTokens(namedAccounts.satiBuyer, {
  //       value: toSmallestUnit(10001, { hexlify: true }),
  //     })
  //     // Not that this is a hardhat throw error and not a revert from contract since hardhat does not allow sending transaction that is higher that the balance
  //   ).to.be.revertedWith(
  //     "InvalidInputError: sender doesn't have enough funds to send tx. The max upfront cost is: 10001029417623067345120 and the sender's account only has: 10000000000000000000000"
  //   )

  //   const buyerBalance = await SatiToken.balanceOf(namedAccounts.satiBuyer)

  //   assert.equal(buyerBalance.toString(), "0")
  // })

  it("Sale can distribute token to buyers", async () => {
    await SatiTokenSale.connect(namedSigners.satiBuyer).buyTokens(namedAccounts.satiBuyer, {
      value: toSmallestUnit("0.01"),
    })

    const buyerBalance = await SatiToken.balanceOf(namedAccounts.satiBuyer)

    expect(buyerBalance).to.equal(toSmallestUnit(30))
  })
})
