// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./SatiToken.sol";
import "./Utils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20TokensSwap.sol";

contract SwapContractFactory is Ownable, Utils {
  struct SwapAndTokenAddresses {
    address swapContractAddress;
    address quoteTokenAddress;
    address baseTokenAddress;
    bool deployed;
  }

  event DeployedSwapContract(
    address indexed swapContractAddress,
    address indexed baseTokenAddress,
    address indexed quoteTokenAddress
  );

  string[] public swapPairs;
  mapping(string => SwapAndTokenAddresses) public deployedSwapContractsRegistry;

  function deployNewSwapContract(
    ERC20 _baseToken,
    ERC20 _quoteToken,
    address _exchangeRate
  ) external onlyOwner {
    ERC20TokensSwap swapContract = new ERC20TokensSwap(_baseToken, _quoteToken, _exchangeRate);

    string memory deployedPair = swapContract.pairName();

    require(
      !deployedSwapContractsRegistry[deployedPair].deployed,
      "Swap contract already deployed"
    );

    swapPairs.push(deployedPair);

    deployedSwapContractsRegistry[deployedPair] = SwapAndTokenAddresses({
      swapContractAddress: address(swapContract),
      quoteTokenAddress: address(_quoteToken),
      baseTokenAddress: address(_baseToken),
      deployed: true
    });

    emit DeployedSwapContract(address(swapContract), address(_baseToken), address(_quoteToken));
  }

  function getAllSwapPairs() external view returns (string[] memory) {
    return swapPairs;
  }
}
