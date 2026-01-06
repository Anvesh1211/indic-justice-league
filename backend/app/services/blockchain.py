# Blockchain Service (Trust Layer)
# Responsibility: Member 3 (Backend Orchestration)

from web3 import Web3
from eth_account import Account
from app.core.config import settings
import json
import os

# 🔐 Toggle this during development
MOCK_BLOCKCHAIN = True

# Load Web3
w3 = Web3(Web3.HTTPProvider(settings.polygon_rpc_url))

# Load ABI
with open("app/data/abi/EvidenceVault.json", "r") as f:
    abi = json.load(f)

# Initialize contract (safe even if address missing in mock mode)
contract = None
if settings.contract_address:
    contract = w3.eth.contract(
        address=Web3.to_checksum_address(settings.contract_address),
        abi=abi
    )

def store_evidence(doc_hash_hex: str) -> str:
    """
    Anchors SHA-256 hash on blockchain.
    Returns transaction hash immediately.
    """

    # 🧪 MOCK MODE (for development & demos)
    if MOCK_BLOCKCHAIN:
        print("🧪 Mock blockchain mode active")
        return f"mock_tx_{doc_hash_hex[:8]}"

    # 🔒 LIVE MODE
    if not contract or not settings.private_key:
        raise Exception("Blockchain not configured")

    account = Account.from_key(settings.private_key)

    # Convert hex hash to bytes32
    try:
        hash_bytes = bytes.fromhex(doc_hash_hex)
    except ValueError:
        raise Exception("Invalid SHA-256 hash")

    nonce = w3.eth.get_transaction_count(account.address)

    tx = contract.functions.registerEvidence(hash_bytes).build_transaction({
        "chainId": 80002,  # Polygon Amoy
        "gas": 500000,
        "maxFeePerGas": w3.to_wei("30", "gwei"),
        "maxPriorityFeePerGas": w3.to_wei("30", "gwei"),
        "nonce": nonce
    })

    signed_tx = w3.eth.account.sign_transaction(tx, settings.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    return w3.to_hex(tx_hash)
