"""
Blockchain Service for storing evidence on Polygon network.
Handles smart contract interactions and transaction management.
"""

from typing import Dict, Any
import json
from web3 import Web3
from eth_account import Account
from app.core.config import settings


class BlockchainService:
    """Service for interacting with Polygon blockchain"""
    
    def __init__(self):
        """Initialize blockchain service with Web3 connection"""
        try:
            self.w3 = Web3(Web3.HTTPProvider(settings.polygon_rpc_url))
            self.is_connected = self.w3.is_connected()
            self.contract_address = Web3.to_checksum_address(settings.contract_address) if settings.contract_address else None
            self.private_key = settings.private_key
            
            # Load contract ABI
            try:
                with open("app/data/abi/EvidenceVault.json", "r") as f:
                    abi_data = json.load(f)
                    # Extract ABI array from artifact
                    self.abi = abi_data.get("abi", abi_data)
            except FileNotFoundError:
                self.abi = None
            
            # Initialize contract if connected
            if self.is_connected and self.contract_address and self.abi:
                self.contract = self.w3.eth.contract(
                    address=self.contract_address,
                    abi=self.abi
                )
            else:
                self.contract = None
                
        except Exception as e:
            raise Exception(f"Failed to initialize blockchain service: {str(e)}")
    
    def compute_document_hash(self, content: str) -> str:
        """Compute SHA-256 hash of document content"""
        import hashlib
        return "0x" + hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def store_evidence(self, evidence_data: str, document_type: str = "Analysis") -> Dict[str, Any]:
        """
        Store evidence hash on blockchain.
        
        Args:
            evidence_data: JSON string containing evidence data
            document_type: Type of document (FIR, Witness, Analysis)
            
        Returns:
            Dictionary containing transaction hash and confirmation details
        """
        try:
            if not self.is_connected:
                return {
                    "status": "error",
                    "message": "Web3 not connected to blockchain",
                    "tx_hash": None
                }
            
            if not self.contract:
                return {
                    "status": "error",
                    "message": "Contract not initialized. Check CONTRACT_ADDRESS and ABI.",
                    "tx_hash": None
                }
            
            # Compute document hash
            doc_hash = self.compute_document_hash(evidence_data)
            doc_hash_bytes = bytes.fromhex(doc_hash[2:])  # Remove '0x' prefix
            
            # Get account from private key
            account = self.w3.eth.account.from_key(self.private_key)
            
            # Build transaction
            txn = self.contract.functions.storeEvidence(
                doc_hash_bytes,
                document_type,
                evidence_data[:500]  # Store first 500 chars as metadata
            ).build_transaction({
                'from': account.address,
                'nonce': self.w3.eth.get_transaction_count(account.address),
                'gas': 500000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            # Sign and send transaction
            signed_txn = account.sign_transaction(txn)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            return {
                "status": "success",
                "tx_hash": receipt.transactionHash.hex(),
                "block_number": receipt.blockNumber,
                "document_hash": doc_hash,
                "gas_used": receipt.gasUsed,
                "message": "Evidence stored on blockchain successfully"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "tx_hash": None
            }
    
    def retrieve_evidence(self, document_hash: str) -> Dict[str, Any]:
        """
        Retrieve stored evidence from blockchain by document hash.
        
        Args:
            document_hash: SHA-256 hash of the document (0x-prefixed)
            
        Returns:
            Dictionary containing retrieved evidence
        """
        try:
            if not self.is_connected or not self.contract:
                return {
                    "status": "error",
                    "message": "Blockchain service not available"
                }
            
            # Convert hash to bytes32
            doc_hash_bytes = bytes.fromhex(document_hash[2:] if document_hash.startswith('0x') else document_hash)
            
            # Call contract view function
            result = self.contract.functions.verifyEvidence(doc_hash_bytes).call()
            
            exists, doc_type, submitter, timestamp, metadata = result
            
            return {
                "status": "success",
                "exists": exists,
                "document_type": doc_type,
                "submitter": submitter,
                "timestamp": timestamp,
                "metadata": metadata,
                "verified": exists
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "verified": False
            }
    
    def verify_evidence_integrity(self, evidence_hash: str) -> Dict[str, Any]:
        """
        Verify the integrity of stored evidence.
        
        Args:
            evidence_hash: Hash of the evidence to verify
            
        Returns:
            Dictionary containing verification results
        """
        try:
            if not self.is_connected:
                return {
                    "status": "error",
                    "message": "Web3 not connected to blockchain"
                }
            
            # TODO: Implement evidence verification
            return {
                "status": "success",
                "verified": True,
                "timestamp": None
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }


def store_evidence(evidence_data: str) -> str:
    """
    Store evidence on blockchain.
    
    Args:
        evidence_data: JSON string containing evidence data
        
    Returns:
        Transaction hash
    """
    try:
        service = BlockchainService()
        result = service.store_evidence(evidence_data)
        return result.get("tx_hash", "")
    except Exception as e:
        # Return empty string on error for backward compatibility
        return ""


def retrieve_evidence(tx_hash: str) -> Dict[str, Any]:
    """
    Retrieve stored evidence from blockchain.
    
    Args:
        tx_hash: Transaction hash
        
    Returns:
        Evidence data
    """
    try:
        service = BlockchainService()
        return service.retrieve_evidence(tx_hash)
    except Exception as e:
        return {"status": "error", "message": str(e)}
