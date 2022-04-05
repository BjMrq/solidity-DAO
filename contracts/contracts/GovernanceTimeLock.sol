// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract GovernanceTimeLock is TimelockController {
  constructor(
    uint256 _blockVotingDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(_blockVotingDelay, proposers, executors) {}
}
