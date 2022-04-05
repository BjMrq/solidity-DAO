import { ReactComponent as BATLogo } from "./BAT.svg";
import { ReactComponent as BNBLogo } from "./BNB.svg";
import { ReactComponent as DAILogo } from "./DAI.svg";
import { ReactComponent as ETHLogo } from "./ETH.svg";
import { ReactComponent as LINKLogo } from "./LINK.svg";
import { ReactComponent as MATICLogo } from "./MATIC.svg";
import { ReactComponent as STILogo } from "./STI.svg";
import { ReactComponent as TRXLogo } from "./TRX.svg";
import { ReactComponent as USDCLogo } from "./USDC.svg";
import { ReactComponent as WBTCLogo } from "./WBTC.svg";
import { ReactComponent as WLTCLogo } from "./WLTC.svg";


export const tokenLogos = {
  BAT: { logo: <BATLogo style={{ maxHeight: "90%" }} />, name: "BAT" },
  BNB: { logo: <BNBLogo style={{ maxHeight: "90%" }} />, name: "BNB" },
  DAI: { logo: <DAILogo style={{ maxHeight: "90%" }} />, name: "DAI" },
  ETH: { logo: <ETHLogo style={{ maxHeight: "90%" }} />, name: "ETH" },
  LINK: { logo: <LINKLogo style={{ maxHeight: "90%" }} />, name: "LINK" },
  MATIC: { logo: <MATICLogo style={{ maxHeight: "90%" }} />, name: "MATIC" },
  STI: { logo: <STILogo style={{ maxHeight: "90%" }} />, name: "STI" },
  TRX: { logo: <TRXLogo style={{ maxHeight: "90%" }} />, name: "TRX" },
  USDC: { logo: <USDCLogo style={{ maxHeight: "90%" }} />, name: "USDC" },
  WBTC: { logo: <WBTCLogo style={{ maxHeight: "90%" }} />, name: "WBTC" },
  WLTC: { logo: <WLTCLogo style={{ maxHeight: "90%" }} />, name: "WLTC" },
} as const;
