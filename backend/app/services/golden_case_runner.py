import json
import os
from app.services.ai_engine import detect_contradictions
from app.services.vector_store import load_chroma_retriever

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
GOLDEN_CASES_PATH = os.path.join(BASE_DIR, "data", "golden_cases.json")

# -----------------------------
# Load data
# -----------------------------
with open(GOLDEN_CASES_PATH, "r", encoding="utf-8") as f:
    golden_cases = json.load(f)

retriever = load_chroma_retriever()

# -----------------------------
# Scoring helpers
# -----------------------------
def score_case(expected_type, predictions):
    """
    Returns (detected, type_match)
    """
    if not predictions:
        return 0, 0

    detected = 1
    type_match = any(
        expected_type.lower() in p.get("contradiction_type", "").lower()
        for p in predictions
    )
    return detected, int(type_match)

# -----------------------------
# Run evaluation
# -----------------------------
total = len(golden_cases)
detected_score = 0
type_score = 0

print("\n🔹 Running Golden Case Evaluation\n")

def evaluate_case(expected_type, predictions):
    if not predictions:
        return {
            "detected": False,
            "detected_type": "None",
            "severity": "None",
            "pass": False
        }

    detected_type = predictions[0].get("contradiction_type", "Unknown")
    severity = predictions[0].get("severity", "Unknown")

    passed = expected_type.lower() in detected_type.lower()

    return {
        "detected": True,
        "detected_type": detected_type,
        "severity": severity,
        "pass": passed
    }


for case in golden_cases:
    case_id = case["case_id"]
    expected_type = case["contradiction_type"]
    fir = case["fir"]
    witness = case["witness"]

    results = detect_contradictions(fir, witness, context="IPC context via RAG")

    d, t = score_case(expected_type, results)
    detected_score += d
    type_score += t

    print(f"Case {case_id}")
    print("Expected Type:", expected_type)
    print("Model Output:", results)
    print("-" * 50)

# -----------------------------
# Final Metrics
# -----------------------------
print("\n✅ Evaluation Summary")
print(f"Total Cases           : {total}")
print(f"Contradiction Detected: {detected_score}/{total}")
print(f"Correct Type Match    : {type_score}/{total}")

print("\n📊 Accuracy Metrics")
print(f"Detection Accuracy    : {detected_score / total:.2f}")
print(f"Type Accuracy         : {type_score / total:.2f}")
print("\n📊 Evaluation Matrix\n")
print(f"{'Case ID':<8} | {'Expected':<15} | {'Detected':<8} | {'Type':<18} | {'Severity':<8} | Result")
print("-" * 90)

for case in golden_cases:
    case_id = case["case_id"]
    expected = case["contradiction_type"]

    results = detect_contradictions(
        case["fir"],
        case["witness"],
        context="IPC context via RAG"
    )

    eval_result = evaluate_case(expected, results)

    print(
        f"{case_id:<8} | "
        f"{expected:<15} | "
        f"{str(eval_result['detected']):<8} | "
        f"{eval_result['detected_type']:<18} | "
        f"{eval_result['severity']:<8} | "
        f"{'PASS' if eval_result['pass'] else 'FAIL'}"
    )
