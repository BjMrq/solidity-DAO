// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Faucet {
  mapping(address => uint256) public lockTime;

  uint64 private faucetDistribution = 0.01 ether;

  event Request(address _beneficiary, uint256 _balance);

  function makeItRain() external payable {
    require(block.timestamp > lockTime[msg.sender], "Lock time has not expired");
    // require(
    //     _beneficiary.balance <= 0.2 ether,
    //     "You already have enough ether to play around with"
    // );
    require(address(this).balance >= faucetDistribution, "Faucet is dry");

    lockTime[msg.sender] = block.timestamp + 1 days;
    
    (bool success, ) = msg.sender.call{value: faucetDistribution}("");
    require(success, "Transfer failed.");

  }

  receive() external payable {}
}
