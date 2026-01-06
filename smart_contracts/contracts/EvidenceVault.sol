// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EvidenceVault {
    string private evidence;

    function storeEvidence(string memory _evidence) public {
        evidence = _evidence;
    }

    function getEvidence() public view returns (string memory) {
        return evidence;
    }
}
