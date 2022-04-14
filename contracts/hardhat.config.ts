import "hardhat-deploy"
import "hardhat-gas-reporter"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/types"
import "dotenv/config"

const hardhatConfig: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: process.env.DEVELOPMENT_MNEMONIC,
      },
      mining: {
        auto: true,
        interval: [10000, 14000],
      },
    },
    localhost: {
      chainId: 1337,
      accounts: {
        mnemonic: process.env.DEVELOPMENT_MNEMONIC,
      },
    },
    rinkeby: {
      url: process.env.RINKERY_NODE_ENDPOINT,
      accounts: { mnemonic: process.env.TESNET_MNEMONIC },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: { default: 0 },
    faucetFounder: { default: 1 },
    faucetUser: { default: 2 },
    astroSender: { default: 3 },
    astroReceiver: { default: 4 },
    astroBuyer: { default: 5 },
    astroSeller: { default: 6 },
    maliciousEncounter: { default: 7 },
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}

export default hardhatConfig
