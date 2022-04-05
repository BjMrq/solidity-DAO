// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Crowdsale.sol";
import "./KYCValidation.sol";
import "./Ratable.sol";


contract SatiTokenSale is Crowdsale {
    KYCValidation private kycValidation;
    bool public KYCValidationEnabled;

    constructor(
        uint256 _fixedExchangeRate,
        address payable _wallet,
        IERC20 _token,
        KYCValidation _kycValidation
    ) Crowdsale(_fixedExchangeRate, _wallet, _token) {
        kycValidation = _kycValidation;
        KYCValidationEnabled = false;
    }

    function requireHasEnoughEther(address _addressToValidate, uint256 _requiredAmount)
        internal
        view
    {
        require(
            address(_addressToValidate).balance >= _requiredAmount,
            "not enough Ether sent"
        );
    }

    function _preValidatePurchase(address _buyer, uint256 _weiAmount) internal view override {


        requireHasEnoughEther(_buyer, _weiAmount);
        
        super._preValidatePurchase(_buyer, _weiAmount);

        if (KYCValidationEnabled) {
            kycValidation.requireKYCCompletion(_buyer);
        }
    }
}
