import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { Button } from "../../../../style/tags/button";
import { ifMountedSetDataStateWith } from "../../../../utils/state-update";
import { toToken, toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { TokenSaleContent } from "../TokenSaleContent";

const StakeSettingInfo = styled.div`
  width: 100%;
  font-size: 1em;
  text-align: left;
  font-weight: bold;
  line-height: 45px;
`

const StakeInfo = styled.div`
  width: 100%;
  font-size: 1em;
  text-align: center;
  font-weight: bold;
  line-height: 45px;
`

export function Stake() {
  const [stakingAstroAmount, setStakingAmount] = useState("")
  const { contracts: {astroStake, astroToken}, toastContractSend, currentAccount} = useContext(Web3Context);
  const [currentlyStaking, setCurrentlyStaking]= useState(false)
  const [stakingSettings, setSettingsSetting]= useState({interestRate: "0", lockDays: "0"})
  const [currentStake, setCurrentStake]= useState({amount: "0", timestamp: "0"})


  const stakeAstro = async () => {
    if(stakingAstroAmount !== "0") {
      const stakeAmount = toUnit(stakingAstroAmount)
      await toastContractSend(astroToken.methods.approve(astroStake.options.address,stakeAmount ), {}, "Approve")
      await toastContractSend(astroStake.methods.stakeTokens(stakeAmount), {}, "Stake")
      setStakingAmount("")
      setCurrentlyStaking(true)
    }
  }

  const unStakeAstro = async () => {
    if(stakingAstroAmount !== "0") {
      await toastContractSend(astroStake.methods.unStakeTokens(), {}, "Unstake")
      setCurrentlyStaking(false)
    }
  }

  useEffect(() => {
    if(astroStake)
    {
      ifMountedSetDataStateWith(astroStake.methods.isCurrentlyStakingTracker(currentAccount).call, setCurrentlyStaking)
      ifMountedSetDataStateWith(
        async () => ({
          interestRate: await astroStake.methods.stakeInterestRateWithFourDecimals().call(),
          lockDays: await astroStake.methods.stakeLockTimeDay().call(), 
        }),
        setSettingsSetting
      )
    }
  }, [astroStake])

  
  const getDaysNumberSince = (stakeTimeStamp: string | number) =>  Math.floor((Number(stakeTimeStamp) - Number(String(+new Date).slice(0, -3))) / (3600 * 24))
  
  const numberOfDaysBeforeRelease = (stakeTimeStamp: string | number, lockTimeInDays: string | number) => Number(lockTimeInDays) - getDaysNumberSince(stakeTimeStamp)

  useEffect(() => {
    if(currentlyStaking && astroStake){
      ifMountedSetDataStateWith( astroStake.methods.lastStakesRegistry(currentAccount).call, setCurrentStake)
    }
  }, [currentlyStaking])
  
  return (
    <TokenSaleContent 
      actionDescription={"Defi staking is the action of locking up your token in a smart contracts for a period of time to earn rewards or interest. Stake your ASTRO for a daily interest."}
    >
      {
        !currentlyStaking ?
          <Fragment>
            <StakeSettingInfo>
            Daily interest rate: {Number(stakingSettings.interestRate) * 0.001 }%
              <br/>
            Minimal lock time: {stakingSettings.lockDays} days
            </StakeSettingInfo>
            <TokenPseudoInput
              tokenToDisplay={tokenLogos["ASTRO"]}
              inputValue={stakingAstroAmount}
              setInputValue={setStakingAmount}
            />
            <div style={{width: "100%"}}>
              <Button onClick={stakeAstro}>Stake</Button>
            </div>
          </Fragment>
          : 
          <Fragment>
            <StakeInfo>
              Staked tokens: {toToken(currentStake.amount)} ASTRO
              <br/>
              Time until release: {numberOfDaysBeforeRelease(currentStake.timestamp, stakingSettings.lockDays)} days
            </StakeInfo>
            {
              numberOfDaysBeforeRelease(currentStake.timestamp, stakingSettings.lockDays) === 0
                ? 
                <div style={{width: "100%"}}>
                  <Button onClick={unStakeAstro}>Unstake</Button>
                </div>
                : <div></div>
            }
          </Fragment>
      }
    </TokenSaleContent>
  );
}