from web3 import Web3
from eth_account import Account
from app.core.config import settings

def anchor_evidence(doc_hash: str) -> str:
    if settings.MOCK_MODE:
        return "simulation_tx_hash"

    if not all([
        settings.POLYGON_RPC_URL,
        settings.PRIVATE_KEY,
        settings.CONTRACT_ADDRESS
    ]):
        raise RuntimeError("Blockchain env vars missing")

    w3 = Web3(Web3.HTTPProvider(settings.POLYGON_RPC_URL))
    account = Account.from_key(settings.PRIVATE_KEY)

    # Real transaction logic goes here
    return "real_tx_hash"

def store_evidence(doc_hash: str):
    return "mock_tx"
