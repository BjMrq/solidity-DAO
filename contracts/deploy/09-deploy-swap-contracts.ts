import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { MOCK_ERC20_SWAP_SUPPLY, ROUGH_POOL_NUMBER, ASTRO_TOKEN_SUPPLY } from "../helpers/variables"
import { ethers } from "hardhat"
import { AstroToken } from "../typechain-types"
import { SwapContractFactory } from "../typechain-types/contracts/SwapContractFactory"
import {
  deployPriceFeedIfNoAddress,
  deploySwapContractWithFactory,
  getContractsBeforeSwapDeploy,
  getERC20ContractAtAddressOrDeployMock,
} from "../helpers/contracts/deploy"
import {
  PossibleNetwork,
  PreSwapDeployPerNetwork,
  PreSwapDeployTokenInfo,
  SwapDeployTokenInfo,
} from "../helpers/types"
import { calculateAstroSupplyWithNumberOfPools } from "../helpers/tokens/supply"
import { supplyLiquidityForSwapContracts } from "../helpers/tokens/founding"

// rinkeby: {
//   ERCTokens: await Promise.all(
//     [
//       {
//         name: "Basic Attention Token",
//         symbol: "BAT",
//         priceFeedAddress: "0x031dB56e01f82f20803059331DC6bEe9b17F7fC9",
//       },
//       {
//         name: "BNB",
//         symbol: "BNB",
//         priceFeedAddress: "0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED",
//       },
//       {
//         name: "USD Coin",
//         symbol: "USDC",
//         priceFeedAddress: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
//       },
//       {
//         name: "Wrapped BTC",
//         symbol: "WBTC",
//         priceFeedAddress: "0xECe365B379E1dD183B20fc5f022230C044d51404",
//       },
//       {
//         name: "Dai Stablecoin",
//         symbol: "DAI",
//         priceFeedAddress: "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF",
//       },
//       {
//         name: "ChainLink Token",
//         symbol: "LINK",
//         priceFeedAddress: "0xd8bD0a1cB028a31AA859A21A3758685a95dE4623",
//       },
//       {
//         name: "TRON",
//         symbol: "TRX",
//         priceFeedAddress: "0xb29f616a0d54FF292e997922fFf46012a63E2FAe",
//       },
//       {
//         name: "Wrapped Litecoin",
//         symbol: "WLTC",
//         priceFeedAddress: "0x4d38a35C2D87976F334c2d2379b535F1D461D9B4",
//       },
//       {
//         name: "Matic Token",
//         symbol: "MATIC",
//         priceFeedAddress: "0x7794ee502922e2b723432DDD852B3C30A911F021",
//       },
//     ].map(async ({ name, symbol, priceFeedAddress }) => ({
//       name,
//       erc20Token: await deployERC20TokenMock(name, symbol),
//       priceFeedAddress,
//     }))
//   ),
// },
// kovan: {
// ERCTokens: [
//   {
//     name: "LINK",
//     erc20Token: "0xa36085f69e2889c224210f603d836748e7dc0088",
//     priceFeedAddress: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0",
//   },
//   {
//     name: "BAT",
//     erc20Token: "0x482dC9bB08111CB875109B075A40881E48aE02Cd",
//     priceFeedAddress: "0x9441D7556e7820B5ca42082cfa99487D56AcA958",
//   },
// ],
// },

const deployAstroSwaps: DeployFunction = async ({
  getNamedAccounts,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract<AstroToken>("AstroToken", deployer)

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
    localhost: [],
    hardhat: [
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
      // {
      //   baseToken: {
      //     name: "Wrapped Litecoin",
      //     symbol: "WLTC",
      //   },
      //   quoteToken: {
      //     address: AstroToken.address,
      //   },
      //   priceFeed: {
      //     rate: "11000000000",
      //   },
      //   swapContract: {
      //     pairName: "WLTC/ASTRO",
      //     baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
      //     quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
      //   },
      // },
      // {
      //   baseToken: {
      //     name: "Matic Token",
      //     symbol: "MATIC",
      //   },
      //   quoteToken: {
      //     address: AstroToken.address,
      //   },
      //   priceFeed: {
      //     rate: "140000000",
      //   },
      //   swapContract: {
      //     pairName: "MATIC/ASTRO",
      //     baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
      //     quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
      //   },
      // },
    ],
    rinkeby: [],
  } as PreSwapDeployPerNetwork

  const currentNetwork = network.name as PossibleNetwork

  const swapPoolsForCurrentNetwork = swapPools[currentNetwork]

  //Get tokens contract or deploy mocks
  const swapPoolsWithTokenContract = await Promise.all(
    swapPoolsForCurrentNetwork.map(getContractsBeforeSwapDeploy)
  )

  //Deploy swap contracts
  await Promise.all(
    swapPoolsWithTokenContract.map(deploySwapContractWithFactory(SwapContractFactory))
  )

  //Provide liquidity
  await Promise.all(
    swapPoolsWithTokenContract.map(supplyLiquidityForSwapContracts(SwapContractFactory))
  )

  //TODO if on rinkeby provide LINK
}

deployAstroSwaps.tags = ["all", "swap", "sales", "governance", "SwapContractFactory"]

export default deployAstroSwaps
