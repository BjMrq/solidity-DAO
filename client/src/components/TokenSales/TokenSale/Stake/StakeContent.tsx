import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { Button } from "../../../../style/tags/button";
import { ifMountedSetDataStateWith } from "../../../../utils/state-update";
import { toToken, toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";


const StakeInfoTitle = styled.div`
  width: 100%;
  margin: auto;
  text-align: left;
  font-weight: bold;
`

const StakeInfo = styled.div`
  width: 100%;
  font-size: 1em;
  text-align: left;
  line-height: 45px;

  @media screen and (max-width: 600px) { 
    line-height: 25px;
 }
`

export function StakeContent() {

  const [stakingAstroAmount, setStakingAmount] = useState("")
  const { contracts: {astroStake, astroToken}, toastContractSend, currentAccount} = useContext(Web3Context);
  const [currentlyStaking, setCurrentlyStaking]= useState(false)
  const [stakingSettings, setSettingsSetting]= useState({interestRate: "0", lockDays: "0"})
  const [currentStake, setCurrentStake]= useState({amount: "0", timestamp: "0"})
  const [currentAstroBalance, setCurrentAstroBalance] = useState("0")


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
    await toastContractSend(astroStake.methods.unStakeTokens(), {}, "Unstake")
    setCurrentlyStaking(false)
  }

  useEffect(() => {
    if(stakingAstroAmount === "") ifMountedSetDataStateWith(astroToken.methods.balanceOf(currentAccount).call
      , setCurrentAstroBalance)
  }, [currentAccount, stakingAstroAmount])

  useEffect(() => {
    if(currentlyStaking && astroStake){
      ifMountedSetDataStateWith( astroStake.methods.lastStakesRegistry(currentAccount).call, setCurrentStake)
    }
  }, [currentlyStaking])

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


  const getDaysNumberSince = (stakeTimeStamp: string | number) => Math.floor((Number(String(+new Date).slice(0, -3)) - Number(stakeTimeStamp)) / (3600 * 24))
  
  const numberOfDaysBeforeRelease = (stakeTimeStamp: string | number, lockTimeInDays: string | number) => {
    const daysBeforeRelease = Number(lockTimeInDays) - getDaysNumberSince(stakeTimeStamp)
    if(daysBeforeRelease >= 0) return daysBeforeRelease
    return 0
  }


  return (
    <Fragment>
      <StakeInfo>
        <StakeInfoTitle>Staking infos</StakeInfoTitle>
      Daily interest rate: {Number(stakingSettings.interestRate) * 0.001 }%
        <br/>
      Minimal lock time: {stakingSettings.lockDays} days
      </StakeInfo>
      {
        !currentlyStaking ?
          <Fragment>
            <TokenPseudoInput
              currentBalance={currentAstroBalance}
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
              <StakeInfoTitle>Your stake</StakeInfoTitle>
              Staked tokens: {toToken(currentStake.amount)} ASTRO
              <br/>
              Time until release: {numberOfDaysBeforeRelease(currentStake.timestamp, stakingSettings.lockDays) > 1 ? 
                `${numberOfDaysBeforeRelease(currentStake.timestamp, stakingSettings.lockDays)} days`  
                :
                `${numberOfDaysBeforeRelease(currentStake.timestamp, stakingSettings.lockDays)} day`            
              }
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
    </Fragment>
  )
}
