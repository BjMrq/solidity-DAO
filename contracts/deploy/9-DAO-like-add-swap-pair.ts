import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { getContractsBeforeSwapDeploy } from "../helpers/contracts/deploy"
import { PossibleNetwork, PreSwapDeployPerNetwork } from "../helpers/types"
import { ethers } from "hardhat"
import { AstroToken, ERC20, GovernanceOrchestrator, SwapContractFactory } from "../typechain-types"
import {
  MOCK_ERC20_SWAP_SUPPLY,
  ROUGH_POOL_NUMBER,
  ASTRO_TOKEN_SUPPLY,
  PROPOSAL_SETTINGS,
} from "../helpers/variables"
import { calculateAstroSupplyWithNumberOfPools } from "../helpers/tokens/supply"
import { asyncSequentialMap } from "../helpers/processing"
import {
  waitForBlockOrMoveBlockIfDevelopment,
  waitForBlockOrMoveTimeIfDevelopment,
} from "../helpers/chain/move-blocks"
import {
  proposeNewSwapContractDeployment,
  voteForProposal,
  queueProposal,
  executeProposal,
} from "../helpers/contracts/propose-swap-dao"
import {
  supplyChainLinkTokenForPriceFeedUsage,
  supplyLiquidityForSwapContracts,
} from "../helpers/tokens/founding"
import { toSmallestUnit } from "../helpers/tokens/utils"

const daoLikeAddSwapPair: DeployFunction = async ({
  getNamedAccounts,
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const currentNetwork = networkName as PossibleNetwork

  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract<AstroToken>("AstroToken", deployer)

  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )
  const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
    "SwapContractFactory",
    deployer
  )

  const astroSupplyPerLiquiditySwap = calculateAstroSupplyWithNumberOfPools(
    ASTRO_TOKEN_SUPPLY.total,
    ASTRO_TOKEN_SUPPLY.swap,
    ROUGH_POOL_NUMBER
  )

  const swapPools = {
    localhost: { pairs: [] },
    hardhat: {
      pairs: [
        {
          baseToken: {
            name: "Basic Attention Token",
            symbol: "BAT",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "80000000",
          },
          swapContract: {
            pairName: "BAT/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Wrapped BTC",
            symbol: "WBTC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "4100000000000",
          },
          swapContract: {
            pairName: "WBTC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "BNB",
            symbol: "BNB",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "38400000000",
          },
          swapContract: {
            pairName: "BNB/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "USD Coin",
            symbol: "USDC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "100000000",
          },
          swapContract: {
            pairName: "USDC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "100000000",
          },
          swapContract: {
            pairName: "DAI/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "ChainLink Token",
            symbol: "LINK",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "1500000000",
          },
          swapContract: {
            pairName: "LINK/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Wrapped Litecoin",
            symbol: "WLTC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "11000000000",
          },
          swapContract: {
            pairName: "WLTC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Matic Token",
            symbol: "MATIC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            rate: "140000000",
          },
          swapContract: {
            pairName: "MATIC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
      ],
    },
    rinkeby: {
      chainLinkTokenAddress: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      pairs: [
        {
          baseToken: {
            name: "Wrapped BTC",
            symbol: "WBTC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0xECe365B379E1dD183B20fc5f022230C044d51404",
          },
          swapContract: {
            pairName: "WBTC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Basic Attention Token",
            symbol: "BAT",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0x031dB56e01f82f20803059331DC6bEe9b17F7fC9",
          },
          swapContract: {
            pairName: "BAT/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "BNB",
            symbol: "BNB",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED",
          },
          swapContract: {
            pairName: "BNB/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "USD Coin",
            symbol: "USDC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
          },
          swapContract: {
            pairName: "USDC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Dai Stablecoin",
            symbol: "DAI",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF",
          },
          swapContract: {
            pairName: "DAI/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "ChainLink Token",
            symbol: "LINK",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623",
          },
          swapContract: {
            pairName: "LINK/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Wrapped Litecoin",
            symbol: "WLTC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0x4d38a35C2D87976F334c2d2379b535F1D461D9B4",
          },
          swapContract: {
            pairName: "WLTC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
        {
          baseToken: {
            name: "Matic Token",
            symbol: "MATIC",
          },
          quoteToken: {
            address: AstroToken.address,
          },
          priceFeed: {
            address: "0x7794ee502922e2b723432DDD852B3C30A911F021",
          },
          swapContract: {
            pairName: "MATIC/ASTRO",
            baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
            quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
          },
        },
      ],
    },
  } as PreSwapDeployPerNetwork

  const alreadyDeployedPairs = await SwapContractFactory.getAllSwapPairs()

  const swapPoolsToSubmitToDao = swapPools[currentNetwork].pairs.filter(
    ({ swapContract: { pairName } }) => !alreadyDeployedPairs.includes(pairName)
  )

  if (swapPoolsToSubmitToDao.length > 0) {
    //Get tokens contract or deploy mocks (we use reduce to execute transaction once at a time)
    const swapPoolsWithTokenContract = await asyncSequentialMap(
      swapPoolsToSubmitToDao,
      getContractsBeforeSwapDeploy
    )

    //Deploy swap contracts with DAO
    //Propose

    const proposals = await asyncSequentialMap(
      swapPoolsWithTokenContract,
      proposeNewSwapContractDeployment(SwapContractFactory, GovernanceOrchestrator)
    )

    await waitForBlockOrMoveBlockIfDevelopment(currentNetwork, PROPOSAL_SETTINGS.votingDelayBlocks)

    //Vote

    await asyncSequentialMap(proposals, voteForProposal(GovernanceOrchestrator))

    await waitForBlockOrMoveBlockIfDevelopment(currentNetwork, PROPOSAL_SETTINGS.votingPeriodBlocks)

    //Queue

    await asyncSequentialMap(proposals, queueProposal(SwapContractFactory, GovernanceOrchestrator))

    await waitForBlockOrMoveTimeIfDevelopment(
      currentNetwork,
      4,
      PROPOSAL_SETTINGS.executionDelaySeconds * 60
    )

    //Execute

    await asyncSequentialMap(
      proposals,
      executeProposal(SwapContractFactory, GovernanceOrchestrator)
    )

    //Liquidity
    await asyncSequentialMap(
      swapPoolsWithTokenContract,
      supplyLiquidityForSwapContracts(SwapContractFactory)
    )

    if (Boolean(swapPools[currentNetwork].chainLinkTokenAddress)) {
      const chainLinkContract = await ethers.getContractAt<ERC20>(
        "ERC20",
        swapPools[currentNetwork].chainLinkTokenAddress as string
      )

      const chainLinkPerContract = (await chainLinkContract.balanceOf(deployer))
        .sub(toSmallestUnit("10"))
        .div(swapPoolsWithTokenContract.length)
        .toString()

      await asyncSequentialMap(
        swapPoolsWithTokenContract,
        supplyChainLinkTokenForPriceFeedUsage(
          SwapContractFactory,
          chainLinkContract,
          chainLinkPerContract
        )
      )
    }
  }
}

daoLikeAddSwapPair.tags = ["all", "swap", "sales", "governance", "SwapContractFactory"]

export default daoLikeAddSwapPair
