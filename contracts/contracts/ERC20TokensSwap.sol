// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./AstroToken.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./Swapable.sol";
import "./ISwapable.sol";

contract ERC20TokensSwap is Context, Swapable {
  ERC20 public quoteToken;
  ERC20 public baseToken;

  constructor(
    ERC20 _baseToken,
    ERC20 _quoteToken,
    address _exchangeRate
  ) Ratable(_exchangeRate) {
    quoteToken = _quoteToken;
    baseToken = _baseToken;
    pairName = concatenateThree(baseToken.symbol(), "/", quoteToken.symbol());
  }

  function requireHasEnoughQuoteToken(address _addressToValidate, uint256 _requiredAmount)
    internal
    view
  {
    requireHasEnoughToken(quoteToken, _addressToValidate, _requiredAmount);
  }

  function requireHasEnoughBaseToken(address _addressToValidate, uint256 _requiredAmount)
    internal
    view
  {
    requireHasEnoughToken(baseToken, _addressToValidate, _requiredAmount);
  }

  function getAvailableBaseTokenLiquidity() public view returns (uint256) {
    return getAvailableTokenAmount(baseToken);
  }

  function getAvailableQuoteTokenLiquidity() public view returns (uint256) {
    return getAvailableTokenAmount(quoteToken);
  }

  //////////////////////////
  ///// Buy base token /////
  //////////////////////////

  function getBidPrice(uint256 _quoteTokenAmount) public override returns (uint256) {
    uint256 baseTokenAmountToExchange = getBaseTokenAmountFromRate(_quoteTokenAmount);

    emit SwapRateInfo(
      concatenateTwo("Bid ", pairName),
      _quoteTokenAmount,
      baseTokenAmountToExchange
    );

    return baseTokenAmountToExchange;
  }

  function swapQuoteForBaseToken(uint256 _quoteTokenAmount) external payable override {
    requireHasEnoughQuoteToken(_msgSender(), _quoteTokenAmount);

    uint256 baseTokenAmount = getBidPrice(_quoteTokenAmount);

    requireHasEnoughBaseToken(address(this), baseTokenAmount);

    quoteToken.transferFrom(_msgSender(), address(this), _quoteTokenAmount);
    baseToken.transfer(_msgSender(), baseTokenAmount);

    emit SwapTransferInfo(_msgSender(), _quoteTokenAmount, baseTokenAmount);
  }

  ///////////////////////////
  ///// Sell base token /////
  ///////////////////////////

  function getAskPrice(uint256 _baseTokenAmount) public override returns (uint256) {
    uint256 quoteTokenToExchange = getQuoteTokenAmountForFromRate(_baseTokenAmount);

    emit SwapRateInfo(concatenateTwo("Ask ", pairName), _baseTokenAmount, quoteTokenToExchange);

    return quoteTokenToExchange;
  }

  function swapBaseForQuoteToken(uint256 _baseTokenAmount) external payable override {
    requireHasEnoughBaseToken(_msgSender(), _baseTokenAmount);

    uint256 quoteTokenAmount = getAskPrice(_baseTokenAmount);

    requireHasEnoughQuoteToken(address(this), quoteTokenAmount);

    baseToken.transferFrom(_msgSender(), address(this), _baseTokenAmount);
    quoteToken.transfer(_msgSender(), quoteTokenAmount);

    emit SwapTransferInfo(_msgSender(), msg.value, quoteTokenAmount);
  }
}
