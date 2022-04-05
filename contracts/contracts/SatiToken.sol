// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract SatiToken is ERC20Votes {
    constructor(uint256 _initialSupply) ERC20("Sati", "STI") ERC20Permit("Sati") {
        _mint(msg.sender, _initialSupply);
    }
}
