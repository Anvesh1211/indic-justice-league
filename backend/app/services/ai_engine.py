"""
AI Engine for analyzing and comparing legal documents.
Uses Google Generative AI (Gemini) and LangChain for document analysis.
"""

# backend/app/services/ai_engine.py
from dotenv import load_dotenv
import os
import json

load_dotenv()  # load variables from .env

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

# -----------------------------
# Utility: simple output parser
# -----------------------------
def parse_output(text: str) -> str:
    """Return text as-is, trimmed."""
    return text.strip()

# -----------------------------
# 1️⃣ Initialize Gemini LLM
# -----------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.0,  # deterministic reasoning
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# -----------------------------
# 2️⃣ Chain-of-Verification Prompt
# -----------------------------
prompt_template = """
You are a Senior Judicial Magistrate assisting in preliminary case analysis.
Analyze contradictions between the FIR and Witness Statement.

Use the following IPC context:
{context}

Instructions:
1. Extract entities (Time, Place, Person, Action) from Document A (FIR).
2. Extract entities from Document B (Witness Statement).
3. Compare entities and flag discrepancies.
4. Verify if discrepancies relate to the retrieved IPC sections.
5. Output ONLY valid JSON.
   - No markdown
   - No comments
   - No explanations
   - Return a JSON array of objects
   - Each object must have keys:
     contradiction_type, source_text_A, source_text_B, explanation, severity

FIR:
{fir_text}

Witness Statement:
{witness_text}
"""

prompt = PromptTemplate.from_template(prompt_template)

def normalize_severity(contradiction_type: str) -> str:
    """
    Deterministic severity mapping for evaluation.
    """
    high = {"Time", "Person", "Accused", "Weapon"}
    medium = {"Location", "Event Description", "Action"}
    
    if contradiction_type in high:
        return "High"
    elif contradiction_type in medium:
        return "Medium"
    else:
        return "Low"

# -----------------------------
# 3️⃣ Reasoning Function
# -----------------------------
def detect_contradictions(
    fir_text: str,
    witness_text: str,
    context: str
) -> list:
    """
    Run Chain-of-Verification reasoning on FIR and Witness text using Gemini.
    """

    chain = prompt | llm

    response = chain.invoke({
        "context": context,
        "fir_text": fir_text,
        "witness_text": witness_text
    })

    # Gemini response → string
    response_text = parse_output(response.content)

    try:
        contradictions = json.loads(response_text)
    except json.JSONDecodeError:
        return []

    if not isinstance(contradictions, list):
        return []

    # Ensure severity always exists
    for c in contradictions:
        c_type = c.get("contradiction_type", "")
        c["severity"] = normalize_severity(c_type)


    return contradictions


# -----------------------------
# 4️⃣ Optional Test Block
# -----------------------------
if __name__ == "__main__":
    fir_example = """At 10 AM, near the Market, A attacked B with a knife."""
    witness_example = """I saw B being attacked around 12 PM at the Bus Stop by A."""

    ipc_context_example = """
IPC Section 378: Theft
IPC Section 300: Murder
"""

    results = detect_contradictions(
        fir_example,
        witness_example,
        ipc_context_example
    )

    print(json.dumps(results, indent=2))
