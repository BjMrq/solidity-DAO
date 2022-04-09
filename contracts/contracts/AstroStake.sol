// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./SimpleStake.sol";


contract AstroStake is SimpleStake {
   constructor(
     ERC20 _erc20Token, uint256 _stakeInterestRateWithFourDecimalsWithFoursDecimals, uint256 _stakeLockTimeDays
     ) SimpleStake(_erc20Token, _stakeInterestRateWithFourDecimalsWithFoursDecimals, _stakeLockTimeDays) {
   }
}