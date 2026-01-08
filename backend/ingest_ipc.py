import json
import os
import time
import chromadb
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def ingest_data():
    # 1. Load Data
    file_path = "app/data/ipc_chunks_final.json"
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found at {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Handle list vs dict structure
    if isinstance(data, list):
        sections = data
    else:
        sections = data.get("sections", [])
        
    print(f"✅ Loaded {len(sections)} sections from {file_path}")

    # 2. Setup Embeddings & DB
    if not os.getenv("GEMINI_API_KEY"):
        print("❌ Error: GEMINI_API_KEY not found in .env")
        return

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # Initialize Persistent Client explicitly
    persistent_client = chromadb.PersistentClient(path="./chroma_db")
    
    # Get or Create Collection
    # We initialize the LangChain wrapper with the client
    # Note: If you want to start fresh, uncomment the next line
    # persistent_client.delete_collection("ipc_data") 
    
    vectorstore = Chroma(
        client=persistent_client,
        embedding_function=embeddings,
        collection_name="ipc_data"
    )

    # 3. Process in Small Batches (Rate Limit Safe)
    BATCH_SIZE = 5  # Small batch size to avoid hitting 429 errors
    total_docs = len(sections)

    print("⏳ Starting ingestion with rate limiting...")

    current_batch = []
    for i, section in enumerate(sections):
        # Prepare content - Adapting to ipc_chunks_final.json structure
        sec_num = section.get("section_number", str(section.get("section", "")))
        sec_title = section.get("section_title", section.get("description", ""))
        law_text = section.get("law_text", "")
        
        # Fallback if law_text is empty, try to construct something
        if not law_text:
             law_text = f"{sec_title}. Punishment: {section.get('punishment', 'Not specified')}"

        page_content = f"Section {sec_num}: {sec_title}. {law_text}"
        
        metadata = {
            "section": str(sec_num),
            "description": sec_title
        }
        doc = Document(page_content=page_content, metadata=metadata)
        current_batch.append(doc)

        # If batch is full or it's the last item, upload
        if len(current_batch) >= BATCH_SIZE or i == total_docs - 1:
            success = False
            retry_count = 0
            
            while not success and retry_count < 5:
                try:
                    print(f"   Processing batch ending at index {i}/{total_docs}...")
                    vectorstore.add_documents(current_batch)
                    success = True
                    # Tiny sleep to be nice to the API
                    time.sleep(2) 
                except Exception as e:
                    if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                        wait_time = 20 * (retry_count + 1)
                        print(f"   ⚠️ Rate limit hit. Sleeping for {wait_time}s...")
                        time.sleep(wait_time)
                        retry_count += 1
                    else:
                        print(f"   ❌ Critical Error in batch: {e}")
                        break
            
            # Clear batch after success (or max retries)
            current_batch = []

    print("🎉 Success! All data ingested into ./chroma_db")

if __name__ == "__main__":
    ingest_data()
