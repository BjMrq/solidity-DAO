import "hardhat-deploy"
import "hardhat-gas-reporter"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/types"

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
        mnemonic: "torch blur drum ridge venue surface ecology round pond happy maximum crush",
      },
      mining: {
        auto: true,
        interval: [10000, 14000],
      },
    },
    localhost: {
      chainId: 1337,
      accounts: {
        mnemonic: "torch blur drum ridge venue surface ecology round pond happy maximum crush",
      },
    },
  },
  namedAccounts: {
    deployer: { default: 0 },
    faucetFounder: { default: 1 },
    faucetUser: { default: 2 },
    satiSender: { default: 3 },
    satiReceiver: { default: 4 },
    satiBuyer: { default: 5 },
    satiSeller: { default: 6 },
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
