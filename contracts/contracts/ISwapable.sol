// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

abstract contract ISwapable {
    string public pairName;

    function getAskPrice(uint256 _ERC20TokenAmount) public virtual returns (uint256);

    function swapBaseForQuoteToken(uint256 _ERC20TokenAmount) external payable virtual;

    function getBidPrice(uint256 _satiAmount) public virtual returns (uint256);

    function swapQuoteForBaseToken(uint256 _satiAmount) external payable virtual;
}
