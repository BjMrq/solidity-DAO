// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract MockERC20Token is ERC20PresetFixedSupply {
    constructor(string memory _name, string memory _symbol)
        ERC20PresetFixedSupply(_name, _symbol, 1000000000000000000000000000, _msgSender())
    {}
}
