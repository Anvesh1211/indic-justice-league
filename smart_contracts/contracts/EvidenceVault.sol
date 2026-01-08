// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EvidenceVault
 * @dev Stores SHA-256 hashes of legal documents for Proof of Existence
 * Implements Trust Layer for Nyaya-Drishti project
 */
contract EvidenceVault {
    struct Evidence {
        bytes32 documentHash;      // SHA-256 hash of document
        string documentType;       // "FIR" or "Witness Statement"
        address submitter;         // Who submitted the evidence
        uint256 timestamp;         // When it was submitted
        string metadata;           // JSON metadata (case ID, etc.)
        bool exists;               // To check if evidence exists
    }

    // Mapping from document hash to Evidence
    mapping(bytes32 => Evidence) public evidenceRegistry;
    
    // Array to track all submitted hashes
    bytes32[] public submittedHashes;

    // Events for transparency
    event EvidenceStored(
        bytes32 indexed documentHash,
        string documentType,
        address indexed submitter,
        uint256 timestamp,
        string metadata
    );

    event EvidenceVerified(
        bytes32 indexed documentHash,
        bool verified,
        uint256 timestamp
    );

    /**
     * @dev Store evidence hash on blockchain
     * @param _documentHash SHA-256 hash of the document
     * @param _documentType Type of document (FIR, Witness, etc.)
     * @param _metadata JSON string with additional metadata
     */
    function storeEvidence(
        bytes32 _documentHash,
        string memory _documentType,
        string memory _metadata
    ) public returns (bool) {
        require(_documentHash != bytes32(0), "Invalid hash");
        require(!evidenceRegistry[_documentHash].exists, "Evidence already exists");

        evidenceRegistry[_documentHash] = Evidence({
            documentHash: _documentHash,
            documentType: _documentType,
            submitter: msg.sender,
            timestamp: block.timestamp,
            metadata: _metadata,
            exists: true
        });

        submittedHashes.push(_documentHash);

        emit EvidenceStored(
            _documentHash,
            _documentType,
            msg.sender,
            block.timestamp,
            _metadata
        );

        return true;
    }

    /**
     * @dev Verify if evidence exists and retrieve details
     * @param _documentHash Hash to verify
     * @return exists Whether the evidence exists
     * @return documentType Type of document
     * @return submitter Address that submitted it
     * @return timestamp When it was submitted
     * @return metadata Additional metadata
     */
    function verifyEvidence(bytes32 _documentHash)
        public
        view
        returns (
            bool exists,
            string memory documentType,
            address submitter,
            uint256 timestamp,
            string memory metadata
        )
    {
        Evidence memory evidence = evidenceRegistry[_documentHash];
        return (
            evidence.exists,
            evidence.documentType,
            evidence.submitter,
            evidence.timestamp,
            evidence.metadata
        );
    }

    /**
     * @dev Get total number of evidence records
     */
    function getEvidenceCount() public view returns (uint256) {
        return submittedHashes.length;
    }

    /**
     * @dev Get evidence hash by index
     */
    function getEvidenceHashByIndex(uint256 index) public view returns (bytes32) {
        require(index < submittedHashes.length, "Index out of bounds");
        return submittedHashes[index];
    }
}
