// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleStake is Ownable {
  ERC20 public Erc20Token;

  struct Stake {
    uint256 amount;
    uint256 timestamp;
  }

  //todo review event for saubmitted vote

  address[] public stakersAddress;
  mapping(address => Stake) public lastStakesRegistry;

  mapping(address => bool) public hasEverStakedTracker;
  mapping(address => bool) public isCurrentlyStakingTracker;

  uint256 public stakeInterestRateWithFourDecimals;
  uint256 public stakeLockTimeDay;

  event NewStake(
    address indexed stakerAddress,
    uint256 indexed stakedAmount,
    uint256 indexed timestamp
  );

  event UnStake(
    address indexed stakerAddress,
    uint256 indexed stakedAmount,
    uint256 indexed rewardAmount
  );

  //Interest rate is calculated with 4 decimals so 1 === 0.0001
  constructor(
    ERC20 _erc20Token,
    uint256 _stakeInterestRateWithFourDecimalsWithFoursDecimals,
    uint256 _stakeLockTimeDays
  ) {
    Erc20Token = _erc20Token;
    stakeInterestRateWithFourDecimals = _stakeInterestRateWithFourDecimalsWithFoursDecimals;
    stakeLockTimeDay = _stakeLockTimeDays;
  }

  //SETTINGS
  function updateInterestRate(uint256 _newInterestRateWithFourDecimals) external onlyOwner {
    stakeInterestRateWithFourDecimals = _newInterestRateWithFourDecimals;
  }

  function updateStakeLockTime(uint256 _newLockTime) external onlyOwner {
    stakeLockTimeDay = _newLockTime;
  }

  // UTILS
  function getNumberOfDaysFromStake(Stake memory stake) internal view returns (uint256) {
    return (block.timestamp - stake.timestamp) / (60 * 60 * 24);
  }

  function getSenderCurrentStakeDays() public view returns (uint256) {
    return getNumberOfDaysFromStake(lastStakesRegistry[msg.sender]);
  }

  // STAKE
  function updateNewStakeTracker() private {
    isCurrentlyStakingTracker[msg.sender] = true;
    hasEverStakedTracker[msg.sender] = true;
  }

  function processStake(uint256 _stakedAmount) private {
    Erc20Token.transferFrom(msg.sender, address(this), _stakedAmount);

    uint256 timestamp = block.timestamp;

    lastStakesRegistry[msg.sender] = Stake({amount: _stakedAmount, timestamp: timestamp});

    emit NewStake(msg.sender, _stakedAmount, timestamp);
  }

  function stakeTokens(uint256 _amountToStakeInWei) public {
    require(_amountToStakeInWei > 0, "staking amount required");
    require(!isCurrentlyStakingTracker[msg.sender], "already staking");

    processStake(_amountToStakeInWei);

    updateNewStakeTracker();
  }

  // UNSTAKE
  function updateUnStakeTracker() private {
    isCurrentlyStakingTracker[msg.sender] = false;
  }

  function processUnStake(Stake memory stakeToUnStake, uint256 _totalStakedDays) private {
    uint256 stakingReward = (stakeToUnStake.amount *
      stakeInterestRateWithFourDecimals *
      _totalStakedDays) / 100000;

    Erc20Token.transfer(msg.sender, stakeToUnStake.amount + stakingReward);

    emit UnStake(msg.sender, stakeToUnStake.amount, stakingReward);
  }

  function unStakeTokens() public {
    require(isCurrentlyStakingTracker[msg.sender], "not staking");

    Stake memory senderStake = lastStakesRegistry[msg.sender];

    uint256 totalStakedDays = getSenderCurrentStakeDays();

    require(totalStakedDays >= stakeLockTimeDay, "lock time has not expired");

    updateUnStakeTracker();

    processUnStake(senderStake, totalStakedDays);
  }
}
