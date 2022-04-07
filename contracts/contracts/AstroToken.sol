// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract AstroToken is ERC20Votes {
  constructor(uint256 _initialSupply) ERC20("Astro Light", "ASTRO") ERC20Permit("Astro Light") {
    _mint(msg.sender, _initialSupply);
  }
}
