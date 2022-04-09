/* eslint-disable @typescript-eslint/no-unused-vars */
import PropTypes, { InferProps } from "prop-types";
import React, {
  createContext,
  ReactElement, useCallback, useEffect, useRef, useState
} from "react";
import { toast, ToastContentProps } from "react-toastify";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core/types";
import { AbiItem } from "web3-utils";
import { errorColor, successColor } from "../style/colors";
import { stringFromHexadecimalNumber } from "../utils";
import { dummyErrorParser } from "../utils/error-parser";
import ERC20TokenAbi from "./abis/artifacts/ERC20.json";
import SwapAbi from "./abis/artifacts/ERC20TokensSwap.json";
import AstroStakeAbi from "./abis/deployments/AstroStake.json";
import AstroAbi from "./abis/deployments/AstroToken.json";
import AstroSaleAbi from "./abis/deployments/AstroTokenSale.json";
import ColorBoxAbi from "./abis/deployments/ColorBox.json";
import FaucetAbi from "./abis/deployments/Faucet.json";
import GovernanceOrchestratorAbi from "./abis/deployments/GovernanceOrchestrator.json";
import SwapContractFactoryAbi from "./abis/deployments/SwapContractFactory.json";
import { AbiWithNetworks, AddTokenToWallet, DeployedNetwork, EthereumAvailableGuard, PossibleSwapToken, SubmitNewColorProposalToDao, SwapContractInfo, ToastContractSend, VoidCall, Web3ContextFunctions } from "./types";
import { AstroStake } from "./types/AstroStake";
import { AstroToken } from "./types/AstroToken";
import { AstroTokenSale } from "./types/AstroTokenSale";
import { ColorBox } from "./types/ColorBox";
import { ERC20 } from "./types/ERC20";
import { ERC20TokensSwap } from "./types/ERC20TokensSwap";
import { Faucet } from "./types/Faucet";
import { GovernanceOrchestrator } from "./types/GovernanceOrchestrator";
import { SwapContractFactory } from "./types/SwapContractFactory";
import { buildDescriptionWithFunctionDetails } from "./utils";


//State
const initialWeb3ContextState = {
  connected: false,
  canParticipateToDao: false,
  currentAccount: "",
  contractsDeployedOnCurrentChain: false,
  web3Instance: new Web3(),
  contracts : {
    faucet: undefined as unknown as Faucet, 
    astroSale: undefined as unknown as AstroTokenSale, 
    factorySwap: undefined as unknown as SwapContractFactory,
    astroToken: undefined as unknown as AstroToken,
    colorBox: undefined as unknown as ColorBox,
    governanceOrchestrator: undefined as unknown as GovernanceOrchestrator,
    astroStake: undefined as unknown as AstroStake,
    swapContracts: [] as SwapContractInfo[]
  },
};


//Merge
type Web3ContextState = typeof initialWeb3ContextState;

type Web3ContextType = Web3ContextState & Web3ContextFunctions;

//Context
export const Web3Context = createContext<Web3ContextType>(
  //@ts-expect-error since we are not defining functions
  initialWeb3ContextState as Web3ContextState
);


const ifEthereumAvailableDo: EthereumAvailableGuard = (web3Callback: any) => (...callbackArgs: any[]) => {
  try {
    if(window.ethereum !== undefined) return web3Callback(...callbackArgs);
    console.error("Ethereum is not available on the window");
  } catch {
    console.error("There where a problem with web3");
  }
}
 
//Provider
export default function Web3ContextProvider({
  children,
}: InferProps<typeof Web3ContextProvider.propTypes>): ReactElement {
  
  const [web3ContractsState, setWeb3ContractsState] = useState<Web3ContextState["contracts"]>(initialWeb3ContextState.contracts);
  const [mainAccount, setMainAccount] = useState("");
  const [canParticipateToDao, setCanParticipateDao] = useState(false);

  const web3InstanceRef = useRef(ifEthereumAvailableDo(() => new Web3(window.ethereum))());
  const [currentChainId, setCurrentChainId] = useState("");

  const initWeb3: VoidCall = ifEthereumAvailableDo(async () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  })

  const addTokenToWallet: AddTokenToWallet = ifEthereumAvailableDo( async (erc20Token: ERC20) => 
  {
    const tokenSymbol = await erc20Token.methods.symbol().call();

    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: erc20Token.options.address,
          decimals: await erc20Token.methods.decimals().call(),
          symbol: tokenSymbol,
          image: `https://raw.githubusercontent.com/BjMrq/solidity-DAO/main/client/src/contracts/crypto-logos/${tokenSymbol}.svg`
        }
      },
    })
  }
  )

  //@ts-expect-error since chainIdToCheck can not directly access the abi but it is what we are testing
  const areContractsDeployedOnChain = (chainIdToCheck: string): chainIdToCheck is DeployedNetwork => Boolean(FaucetAbi.networks[chainIdToCheck])

  const buildSwapPairInfo = (factorySwapContract: SwapContractFactory) => async (pairName: string): Promise<SwapContractInfo> => {
    const [baseTokenName, quoteTokenName] = pairName.split("/") as [PossibleSwapToken, PossibleSwapToken]
    const {
      swapContractAddress,
      baseTokenAddress,
      quoteTokenAddress
    } = await factorySwapContract.methods.deployedSwapContractsRegistry(pairName).call()

    return {
      pairName, 
      swapContract: new web3InstanceRef.current.eth.Contract(
        SwapAbi.abi as AbiWithNetworks["abi"],
        swapContractAddress
      ) as unknown as ERC20TokensSwap,
      baseToken: {
        name: baseTokenName,
        contract: new web3InstanceRef.current.eth.Contract(
          ERC20TokenAbi.abi as AbiWithNetworks["abi"],
          baseTokenAddress
        ) as unknown as ERC20
      },
      quoteToken: {
        name: quoteTokenName,
        contract: new web3InstanceRef.current.eth.Contract(
          ERC20TokenAbi.abi as AbiWithNetworks["abi"],
          quoteTokenAddress
        ) as unknown as ERC20
      }
    }
  }

  const loadSwapContacts = async (factorySwapContract: SwapContractFactory): Promise<SwapContractInfo[]> => await Promise.all((await factorySwapContract.methods.getAllSwapPairs().call()).map(buildSwapPairInfo(factorySwapContract)))


  const loadContractsIfDeployedOnChain = async (chainId: DeployedNetwork) => {
    
    const faucet = new web3InstanceRef.current.eth.Contract(
      FaucetAbi.abi as AbiWithNetworks["abi"],
      FaucetAbi.networks[chainId].address
    ) as unknown as Faucet

    const astroToken = new web3InstanceRef.current.eth.Contract(
      AstroAbi.abi as AbiWithNetworks["abi"],
      AstroAbi.networks[chainId].address
    ) as unknown as AstroToken

    const astroSale = new web3InstanceRef.current.eth.Contract(
      AstroSaleAbi.abi as AbiWithNetworks["abi"],
      AstroSaleAbi.networks[chainId].address
    ) as unknown as AstroTokenSale

    const astroStake = new web3InstanceRef.current.eth.Contract(
      AstroStakeAbi.abi as AbiWithNetworks["abi"],
      AstroStakeAbi.networks[chainId].address
    ) as unknown as AstroStake

    const factorySwap = new web3InstanceRef.current.eth.Contract(
      SwapContractFactoryAbi.abi as AbiWithNetworks["abi"],
      SwapContractFactoryAbi.networks[chainId].address
    ) as unknown as SwapContractFactory


    const colorBox = new web3InstanceRef.current.eth.Contract(
      ColorBoxAbi.abi as AbiWithNetworks["abi"],
      ColorBoxAbi.networks[chainId].address
    ) as unknown as ColorBox

    const governanceOrchestrator = new web3InstanceRef.current.eth.Contract(
      GovernanceOrchestratorAbi.abi as AbiWithNetworks["abi"],
      GovernanceOrchestratorAbi.networks[chainId].address
    ) as unknown as GovernanceOrchestrator

    setWeb3ContractsState({
      astroToken,
      faucet,
      astroSale,
      astroStake,
      factorySwap,
      colorBox,
      governanceOrchestrator,
      swapContracts: await loadSwapContacts(factorySwap)
    })
    
  }

  const submitNewColorProposalToDao: SubmitNewColorProposalToDao = async ({color, description}) => {

    toastContractSend(
      web3ContractsState.governanceOrchestrator.methods.propose(
        [ColorBoxAbi.networks[currentChainId as DeployedNetwork].address],
        [0],
        [
          web3InstanceRef.current.eth.abi
            .encodeFunctionCall((ColorBoxAbi.abi).find(({name}) => name === "changeColor") as AbiItem, [color])
        ],
        buildDescriptionWithFunctionDetails("changeColor()", [color], description)
      )
    )
  }

  const updateDaoParticipationGuard: VoidCall = useCallback(async () => {
    if(web3ContractsState.astroToken && mainAccount) setCanParticipateDao(await web3ContractsState.astroToken.methods.balanceOf(mainAccount).call() !== "0")
  }, [web3ContractsState, mainAccount])

  useEffect(() => {
    updateDaoParticipationGuard()
  }, [updateDaoParticipationGuard])

  useEffect(() => {
    (async () => {
      if(areContractsDeployedOnChain(currentChainId)) await loadContractsIfDeployedOnChain(currentChainId)
    }
    )();
  
  }, [currentChainId]) 


  const listenForWeb3Changes = () => {
    window.ethereum.on("accountsChanged", function ([mainAccount]: string[]) {
      console.info("accountsChanged", mainAccount);
      setMainAccount(mainAccount || "")
    });

    window.ethereum.on('chainChanged', function(chainIdHex: string){
      const chainId = stringFromHexadecimalNumber(chainIdHex)
      console.info('chainChanged',chainIdHex, chainId)
      setCurrentChainId(chainId)
    });
  }


  useEffect(() => {
    ifEthereumAvailableDo((async () => {
      setCurrentChainId(String(await web3InstanceRef.current.eth.net.getId()))

      setMainAccount((await web3InstanceRef.current.eth.getAccounts())[0])
      
      listenForWeb3Changes()
    }))();
  }, []);
  


  const TransactionSuccessToast = ({ data }: ToastContentProps<TransactionReceipt>, transactionDisplayName: string) => (
    <div>
      <div>{transactionDisplayName} succeeded</div>
      <a target="_blank" style= {{color: "#23379d", textDecoration: "none", fontSize: "1.2rem"}} href={`https://kovan.etherscan.io/tx/${data?.transactionHash}`}>🔎 view on etherscan</a>
    </div>
  ) as ReactElement
  
  const toastContractSend: ToastContractSend = async (contractFunctionToSend, transactionOptions = {}, transactionDisplayName = "Transaction") => 
    toast.promise(
      async () => contractFunctionToSend.send({ from: mainAccount, ...transactionOptions }),
      {
        pending: {
          render(){
            return `${transactionDisplayName} pending..`
          },
          icon: true,
        
        },
        success: {
          render({data, closeToast, toastProps}: ToastContentProps<TransactionReceipt>){
            console.info(data);
            return TransactionSuccessToast({closeToast, toastProps, data}, transactionDisplayName)
          },
          style: {backgroundColor: successColor},
        },
        error: {
          render({data}: {data: Error}){
            return dummyErrorParser(data)
          },
          style: {backgroundColor: errorColor},
        }
      }
    )

  return (
    <Web3Context.Provider
      value={{
        web3Instance: web3InstanceRef.current,
        canParticipateToDao,
        connected: Boolean( mainAccount),
        contractsDeployedOnCurrentChain: areContractsDeployedOnChain(currentChainId),
        currentAccount: mainAccount,
        contracts: web3ContractsState,
        updateDaoParticipationGuard,
        initWeb3,
        addTokenToWallet,
        toastContractSend,
        submitNewColorProposalToDao
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
