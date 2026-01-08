import json
import os
import time
import chromadb
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

# Disable ChromaDB Telemetry (removes the annoying "Failed to send telemetry" logs)
os.environ["ANONYMIZED_TELEMETRY"] = "False"

load_dotenv()

def ingest_data():
    # 1. Configuration
    # Make sure this matches your actual file name found in the logs
    FILE_PATH = "app/data/ipc_chunks_final.json" 
    # Use the newer model which often has better availability
    EMBEDDING_MODEL = "models/text-embedding-004" 
    BATCH_SIZE = 5      # Keep small
    SLEEP_TIME = 10     # Mandatory rest between batches (Seconds)

    # 2. Load Data
    if not os.path.exists(FILE_PATH):
        # Fallback to the other name if the first one fails
        FILE_PATH = "app/data/ipc.json"
        
    if not os.path.exists(FILE_PATH):
        print(f"❌ Error: Could not find ipc.json or ipc_chunks_final.json in app/data/")
        return

    with open(FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Handle different JSON structures (list of sections vs dictionary)
    if isinstance(data, list):
        sections = data
    else:
        sections = data.get("sections", [])
        
    print(f"✅ Loaded {len(sections)} sections from {FILE_PATH}")

    # 3. Initialize Client & VectorStore (The Fix)
    if not os.getenv("GEMINI_API_KEY"):
        print("❌ Error: GEMINI_API_KEY not found in .env")
        return

    print(f"🔌 Connecting to ChromaDB with model: {EMBEDDING_MODEL}...")
    
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    persistent_client = chromadb.PersistentClient(path="./chroma_db")
    
    # Initialize the collection reference ONCE before the loop
    vectorstore = Chroma(
        client=persistent_client,
        embedding_function=embeddings,
        collection_name="ipc_data"
    )

    # 4. Ingest Loop
    print("⏳ Starting ingestion... (This will take time due to rate limits)")
    
    current_batch = []
    total_docs = len(sections)

    for i, section in enumerate(sections):
        # Construct content
        # Handle cases where keys might be different (e.g. 'Section' vs 'section')
        sec_num = section.get('section') or section.get('Section', 'Unknown')
        desc = section.get('description') or section.get('Description', '')
        punish = section.get('punishment') or section.get('Punishment', '')
        
        # Fallback for ipc_chunks_final.json structure if keys are different
        if not sec_num or sec_num == 'Unknown':
             sec_num = section.get("section_number", "Unknown")
        if not desc:
             desc = section.get("section_title", "")
             # Append law_text if available for richer context
             law_text = section.get("law_text", "")
             if law_text:
                 desc += f". {law_text}"

        page_content = f"Section {sec_num}: {desc}. Punishment: {punish}"
        metadata = {
            "section": str(sec_num),
            "description": desc[:100] # Truncate metadata to save space
        }
        
        doc = Document(page_content=page_content, metadata=metadata)
        current_batch.append(doc)

        # Upload when batch is full
        if len(current_batch) >= BATCH_SIZE or i == total_docs - 1:
            try:
                print(f"   Processing batch {i+1}/{total_docs}...")
                vectorstore.add_documents(current_batch)
                
                # ✅ Mandatory Sleep to respect API Quota
                time.sleep(SLEEP_TIME) 
                
            except Exception as e:
                print(f"   ⚠️ Error on batch {i}: {e}")
                # If we hit a rate limit, wait significantly longer
                if "429" in str(e):
                    print("   🛑 Rate Limit Hit. Sleeping for 60 seconds...")
                    time.sleep(60)
                    # Try one more time
                    try:
                        vectorstore.add_documents(current_batch)
                    except:
                        print("   ❌ Batch skipped after retry.")
            
            # Reset batch
            current_batch = []

    print("🎉 Success! Data ingestion complete.")

if __name__ == "__main__":
    ingest_data()
