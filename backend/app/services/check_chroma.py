from dotenv import load_dotenv
load_dotenv()

from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os

CHROMA_PATH = "app/data/chroma_ipc_db"

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001"
)

db = Chroma(
    persist_directory=CHROMA_PATH,
    embedding_function=embeddings
)

print("Collections:", db._client.list_collections())
