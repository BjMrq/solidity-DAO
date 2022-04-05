// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Utils {
    function concatenateTwo(string memory partOne, string memory partTwo)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(partOne, partTwo));
    }

    function concatenateThree(
        string memory partOne,
        string memory partTwo,
        string memory partThree
    ) internal pure returns (string memory) {
        return concatenateTwo(concatenateTwo(partOne, partTwo), partThree);
    }
}
