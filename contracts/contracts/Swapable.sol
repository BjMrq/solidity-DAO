// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ratable.sol";
import "./Utils.sol";
import "./ISwapable.sol";

abstract contract Swapable is Ratable, Utils, ISwapable {
    uint8 private precisionDecimals = 18;

    event SwapTransferInfo(
        address indexed beneficiary,
        uint256 indexed amountSent,
        uint256 indexed amountReceived
    );

    event SwapRateInfo(
        string indexed exchangeType,
        uint256 indexed sellingAmount,
        uint256 indexed buyingAmount
    );

    function requireHasEnoughToken(
        ERC20 _tokenAddress,
        address _addressToValidate,
        uint256 _requiredAmount
    ) internal view {
        require(
            _tokenAddress.balanceOf(_addressToValidate) >= _requiredAmount,
            concatenateTwo("Not enough ", _tokenAddress.symbol())
        );
    }

    function getAvailableTokenAmount(ERC20 _tokenToCheckBalanceOf) internal view returns (uint256) {
        return _tokenToCheckBalanceOf.balanceOf(address(this));
    }

    function getQuoteTokenAmountForFromRate(uint256 _ERC20TokenAmount) internal returns (uint256) {
        int256 exchangeRate = getScaledRate(precisionDecimals);

        return
            scaleTokenForMultiplication(_ERC20TokenAmount, precisionDecimals) *
            uint256(exchangeRate);
    }

    function getBaseTokenAmountFromRate(uint256 _satiAmount) internal returns (uint256) {
        int256 exchangeRate = getScaledRate(precisionDecimals);

        return scaleTokenForDivision(_satiAmount, precisionDecimals) / uint256(exchangeRate);
    }
}
