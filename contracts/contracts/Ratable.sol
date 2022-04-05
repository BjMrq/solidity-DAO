// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Ratable {
    event Rate(int256 indexed scaledPrice, uint256 indexed timeStamp);

    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeedContract) {
        priceFeed = AggregatorV3Interface(_priceFeedContract);
    }

    function scaleTokenForMultiplication(uint256 _tokenAmount, uint8 _decimals)
        internal
        pure
        returns (uint256)
    {
        return _tokenAmount / uint256(10**uint256(_decimals));
    }

    function scaleTokenForDivision(uint256 _tokenAmount, uint8 _decimals)
        internal
        pure
        returns (uint256)
    {
        return _tokenAmount * uint256(10**uint256(_decimals));
    }

    function scalePrice(
        int256 _price,
        uint8 _priceDecimals,
        uint8 _decimals
    ) internal pure returns (int256) {
        if (_priceDecimals < _decimals) {
            return _price * int256(10**uint256(_decimals - _priceDecimals));
        } else if (_priceDecimals > _decimals) {
            return _price / int256(10**uint256(_priceDecimals - _decimals));
        }
        return _price;
    }

    function getScaledRate(uint8 _scalingDecimal) public returns (int256) {
        (, int256 price, , uint256 timeStamp, ) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();

        int256 scaledPrice = scalePrice(price, decimals, _scalingDecimal);

        emit Rate(scaledPrice, timeStamp);

        return scaledPrice;
    }
}
