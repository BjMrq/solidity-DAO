// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./SatiToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Swapable.sol";
import "./ISwapable.sol";

contract EthQuoteSwap is Context, Ownable, Swapable {
    SatiToken public quoteToken;

    constructor(SatiToken _quoteToken, address _ethToUsdRate) Ratable(_ethToUsdRate) {
        quoteToken = _quoteToken;
        pairName = concatenateTwo("ETH/", quoteToken.symbol());
    }

    function requireHasEnoughBaseToken(address _addressToValidate, uint256 _requiredAmount)
        internal
        view
    {
        requireHasEnoughToken(quoteToken, _addressToValidate, _requiredAmount);
    }

    function requireHasEnoughQuoteToken(address _addressToValidate, uint256 _requiredAmount)
        internal
        view
    {
        require(address(_addressToValidate).balance >= _requiredAmount, "Not enough ETH");
    }

    //////////////////
    //// Buy Sati ////
    //////////////////

    function getAskPrice(uint256 _baseTokenAmount) public override returns (uint256) {
        uint256 tokenAmountToExchange = getQuoteTokenAmountForFromRate(_baseTokenAmount);

        emit SwapRateInfo("ETH to STI", _baseTokenAmount, tokenAmountToExchange);

        return tokenAmountToExchange;
    }

    function swapBaseForQuoteToken(uint256 _baseTokenAmount) external payable override {
        uint256 quoteTokenAmount = getAskPrice(_baseTokenAmount);

        requireHasEnoughBaseToken(address(this), quoteTokenAmount);
        requireHasEnoughQuoteToken(address(this), _baseTokenAmount);

        quoteToken.transfer(_msgSender(), quoteTokenAmount);

        emit SwapTransferInfo(_msgSender(), _baseTokenAmount, quoteTokenAmount);
    }

    ///////////////////
    //// Sell Sati ////
    ///////////////////

    function getBidPrice(uint256 _quoteToken) public override returns (uint256) {
        uint256 tokenAmountToExchange = getBaseTokenAmountFromRate(_quoteToken);

        emit SwapRateInfo("STI to ETH", _quoteToken, tokenAmountToExchange);

        return tokenAmountToExchange;
    }

    function swapQuoteForBaseToken(uint256 _quoteTokenAmount) external payable override {
        requireHasEnoughBaseToken(_msgSender(), _quoteTokenAmount);

        uint256 weiAmount = getBidPrice(_quoteTokenAmount);

        requireHasEnoughQuoteToken(address(_msgSender()), weiAmount);

        quoteToken.transferFrom(_msgSender(), address(this), _quoteTokenAmount);

        emit SwapTransferInfo(_msgSender(), _quoteTokenAmount, weiAmount);
    }
}
