from dotenv import load_dotenv
load_dotenv()

import os
import json
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.schema import Document

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "ipc_chunks_final.json")
CHROMA_DIR = os.path.join(BASE_DIR, "data", "chroma_ipc_db")

# 🔹 Single source of truth
COLLECTION_NAME = "ipc_sections"

# -----------------------------
# Load IPC JSON
# -----------------------------
def load_ipc_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# -----------------------------
# Convert IPC → LangChain Docs
# -----------------------------
def ipc_to_documents(ipc_chunks):
    docs = []

    for chunk in ipc_chunks:
        content = (
            f"IPC Section {chunk['section_number']} - {chunk['section_title']}\n\n"
            f"{chunk['law_text']}"
        )

        metadata = {
            # ✅ PDF-required schema
            "section": chunk["section_number"],
            "title": chunk["section_title"],
            "source": chunk.get("source", "IPC"),
        }

        docs.append(
            Document(
                page_content=content,
                metadata=metadata
            )
        )

    return docs

# -----------------------------
# One-time ingestion
# -----------------------------
def ingest_ipc_to_chroma():
    if os.path.exists(CHROMA_DIR):
        print("✅ ChromaDB already exists. Skipping embedding.")
        return

    print("🔹 Loading IPC data...")
    ipc_chunks = load_ipc_data()
    print(f"Loaded {len(ipc_chunks)} IPC sections")

    print("🔹 Preparing documents...")
    documents = ipc_to_documents(ipc_chunks)

    print("🔹 Initializing Gemini embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

    print("🔹 Creating ChromaDB (one-time operation)...")
    vectordb = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=CHROMA_DIR,
    )

    vectordb.persist()
    print("✅ IPC Vector DB created successfully")

# -----------------------------
# Retriever for Part C
# -----------------------------
def load_chroma_retriever():
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

    db = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME
    )

    return db.as_retriever(search_kwargs={"k": 3})

# -----------------------------
if __name__ == "__main__":
    ingest_ipc_to_chroma()
