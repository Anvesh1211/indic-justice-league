from dotenv import load_dotenv
load_dotenv()

import os
import json
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.schema import Document

# Load environment variables
load_dotenv()

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "ipc_chunks_final.json")
CHROMA_DIR = os.path.join(BASE_DIR, "data", "chroma_ipc_db")

COLLECTION_NAME = "ipc_laws"


def load_ipc_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def ipc_to_documents(ipc_chunks):
    docs = []
    for chunk in ipc_chunks:
        content = f"""
IPC Section {chunk['section_number']}: {chunk['section_title']}

{chunk['law_text']}
""".strip()

        metadata = {
            "ipc_id": chunk["id"],
            "section_number": chunk["section_number"],
            "source": chunk["source"],
        }

        docs.append(Document(page_content=content, metadata=metadata))

    return docs


def ingest_ipc_to_chroma():
    if os.path.exists(CHROMA_DIR):
        print("ChromaDB already exists. Skipping embedding.")
        return

    print("🔹 Loading IPC data...")
    ipc_chunks = load_ipc_data()
    print(f"Loaded {len(ipc_chunks)} IPC sections")

    print("🔹 Preparing documents...")
    documents = ipc_to_documents(ipc_chunks)

    print("🔹 Initializing Google embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )

    print("🔹 Creating ChromaDB (this runs ONCE)...")
    vectordb = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        collection_name="ipc_sections",
        persist_directory=CHROMA_DIR,
    )

    vectordb.persist()
    print("IPC Vector DB created successfully")


if __name__ == "__main__":
    ingest_ipc_to_chroma()
