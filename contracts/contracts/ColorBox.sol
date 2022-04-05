// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ColorBox is Ownable {
  string private color;

  // Emitted when the stored value changes
  event ColorChanged(string newValue);

  constructor(string memory initialColor) {
    color = initialColor;
  }

  // Stores a new value in the contract
  function changeColor(string calldata newColor) public onlyOwner {
    color = newColor;
    emit ColorChanged(newColor);
  }

  // Reads the last stored value
  function getColor() public view returns (string memory) {
    return color;
  }
}
