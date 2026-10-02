"""Streamlit Web UI for Fake News Detector with inline LIME word highlighting."""

import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(root_dir))

import streamlit as st
import requests
import html

# Page Config
st.set_page_config(
    page_title="Fake News Detector & Explainer",
    page_icon="📰",
    layout="wide",
)

# Custom Styling
st.markdown("""
<style>
    .metric-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        border-left: 5px solid #007bff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .badge-real {
        background-color: #28a745;
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 18px;
    }
    .badge-fake {
        background-color: #dc3545;
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 18px;
    }
    .highlight-fake {
        background-color: #ffcccc;
        color: #900;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: bold;
    }
    .highlight-real {
        background-color: #ccffcc;
        color: #060;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

st.title("📰 Production Fake News Detector & Explainer")
st.caption("AI-powered credibility scoring, model comparison, and word-level explainability (LIME).")

# Preset Example Articles
EXAMPLES = {
    "Official Reuters News Report (Real)": (
        "WASHINGTON (Reuters) - The Senate passed the bipartisan infrastructure bill after weeks of negotiations. "
        "Federal Reserve officials met with treasury representatives to discuss regional transport grants and budget allocation."
    ),
    "Sensationalized Headline (Fake)": (
        "BREAKING: Secret documents prove shocking government conspiracy uncovered by whistleblowers! "
        "Share this article before it gets deleted by censorship algorithms immediately!"
    ),
    "Ambiguous Political Statement": (
        "Economic policy makers gathered in London to discuss inflation targets, but critics argue the proposed tax hikes will devastate local businesses."
    )
}

# Sidebar Controls
with st.sidebar:
    st.header("⚙️ Settings")
    model_choice = st.radio(
        "Select Model Architecture:",
        options=["Baseline (TF-IDF + LogReg)", "DistilBERT Transformer", "⚡ Side-by-Side Comparison Mode"]
    )
    
    st.subheader("💡 Try Example News Articles")
    selected_example = st.selectbox("Choose a sample preset:", ["-- Custom Input --"] + list(EXAMPLES.keys()))

    api_url = st.text_input("FastAPI Backend URL:", value="http://127.0.0.1:8000")

# Input text handling
default_text = EXAMPLES[selected_example] if selected_example != "-- Custom Input --" else ""
user_text = st.text_area("Paste News Article or Headline:", value=default_text, height=180, placeholder="Paste text here...")


def highlight_text(text: str, highlights: list) -> str:
    """Renders HTML text with color-coded highlighted words."""
    if not highlights:
        return html.escape(text)

    token_weights = {h["token"].lower(): h for h in highlights}
    words = text.split()
    rendered_words = []

    for word in words:
        clean_word = word.strip(".,!?\"'()[]{}").lower()
        if clean_word in token_weights:
            item = token_weights[clean_word]
            direction = item["direction"]
            weight = item["weight"]
            css_class = "highlight-fake" if direction == "fake" else "highlight-real"
            tooltip = f"Weight: {weight:+.3f} ({direction.upper()})"
            rendered_words.append(
                f'<span class="{css_class}" title="{tooltip}">{html.escape(word)}</span>'
            )
        else:
            rendered_words.append(html.escape(word))

    return " ".join(rendered_words)


def call_api(text: str, model_id: str) -> dict:
    """Helper to query FastAPI server or fallback to internal predictor."""
    try:
        resp = requests.post(
            f"{api_url}/predict",
            json={"text": text, "model": model_id, "explain": True},
            timeout=10
        )
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass

    # Direct Python fallback if FastAPI server is not running
    from src.models.predict import predictor
    from src.explain.lime_explainer import explainer
    res = predictor.predict_single(text, model_name=model_id)
    raw_exp = explainer.explain(text, model_name=model_id, num_features=8)
    res["highlights"] = raw_exp
    return res


if st.button("🚀 Analyze Article Credibility", type="primary", use_container_width=True):
    if not user_text.strip() or len(user_text.strip()) < 10:
        st.warning("Please enter at least 10 characters of news text.")
    else:
        if "Side-by-Side" in model_choice:
            col1, col2 = st.columns(2)

            with col1:
                st.subheader("1. Baseline (TF-IDF + LogReg)")
                with st.spinner("Analyzing with Baseline..."):
                    res1 = call_api(user_text, "baseline")
                
                badge_class = "badge-fake" if res1["label"] == "Fake" else "badge-real"
                st.markdown(f'<span class="{badge_class}">{res1["label"].upper()}</span>', unsafe_allow_html=True)
                st.write(f"**Credibility Score:** {res1['credibility_score_pct']}%")
                st.progress(res1['credibility_score_pct'] / 100.0)
                st.caption(f"Latency: {res1['latency_ms']} ms")

            with col2:
                st.subheader("2. Fine-tuned DistilBERT")
                with st.spinner("Analyzing with DistilBERT..."):
                    res2 = call_api(user_text, "bert")
                
                badge_class = "badge-fake" if res2["label"] == "Fake" else "badge-real"
                st.markdown(f'<span class="{badge_class}">{res2["label"].upper()}</span>', unsafe_allow_html=True)
                st.write(f"**Credibility Score:** {res2['credibility_score_pct']}%")
                st.progress(res2['credibility_score_pct'] / 100.0)
                st.caption(f"Latency: {res2['latency_ms']} ms")

            st.divider()
            st.subheader("🔍 Influential Word Highlights")
            rendered_html = highlight_text(user_text, res1.get("highlights", []))
            st.markdown(f'<div style="font-size: 16px; line-height: 1.6;">{rendered_html}</div>', unsafe_allow_html=True)

        else:
            model_id = "bert" if "DistilBERT" in model_choice else "baseline"
            with st.spinner(f"Analyzing text using {model_choice}..."):
                res = call_api(user_text, model_id)

            badge_class = "badge-fake" if res["label"] == "Fake" else "badge-real"
            
            c1, c2, c3 = st.columns([1, 2, 1])
            with c1:
                st.write("### Prediction Label")
                st.markdown(f'<span class="{badge_class}">{res["label"].upper()}</span>', unsafe_allow_html=True)
            with c2:
                st.write(f"### Credibility Score: {res['credibility_score_pct']}%")
                st.progress(res['credibility_score_pct'] / 100.0)
            with c3:
                st.write("### Model Metadata")
                st.write(f"**Model:** {res['model_used']}")
                st.write(f"**Latency:** {res['latency_ms']} ms")

            st.divider()
            st.subheader("🔍 LIME Explainability Highlights")
            st.write("🟢 **Green** tokens push toward **REAL** news | 🔴 **Red** tokens push toward **FAKE** news")
            
            rendered_html = highlight_text(user_text, res.get("highlights", []))
            st.markdown(f'<div style="font-size: 16px; line-height: 1.6; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">{rendered_html}</div>', unsafe_allow_html=True)


# Limitations & About Expander
with st.expander("ℹ️ About & Production Limitations (Must Read)"):
    st.markdown("""
    ### ⚠️ Crucial System Limitations
    - **Style vs. Fact-Checking**: This AI model analyzes **writing style, syntax patterns, and sensationalist vocabulary**. It does **NOT** verify ground-truth facts or perform live web queries.
    - **Dataset Source Bias**: Trained on public news datasets (e.g. ISOT dataset). Models can inherit dataset-specific artifacts if uncleaned.
    - **False Positives**: Genuine articles containing sensationalist phrasing (e.g. op-eds or breaking news) may be flagged incorrectly.
    - **Adversarial Evasion**: Sophisticated fake news written in neutral, formal AP/Reuters journalistic style may evade stylistic detection.
    """)
