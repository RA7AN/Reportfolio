---
type: "projects"
count: 7
lastUpdated: "2026-10-07T00:00:00.000Z"
---

[
  {
    "id": 6,
    "title": "Revent AI Lab",
    "url": "https://ailab.revent.store",
    "tools": [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "Redis",
      "BullMQ",
      "Better Auth",
      "Stripe"
    ],
    "dateLabel": "Apr 2026 - Present",
    "highlights": [
      "AI agents as a subscription product: multi-tenant, billable, alive in production.",
      "AI Engineer on the platform: company onboarding, per-agent subscription plans, billing through Stripe.",
      "Multi-tenant B2B SaaS on Next.js 16 and Postgres with Drizzle, Redis and BullMQ background jobs, envelope-encrypted secrets, Better Auth for email/password and Google OAuth, and Stripe subscription items per agent."
    ],
    "problem": "Companies want agents they can subscribe to, not one-off builds that never survive the jump to production.",
    "sortOrder": 1,
    "isResearch": "no",
    "githubRepo": null
  },
  {
    "id": 7,
    "title": "SafeSight: Safety Inspection Copilot",
    "url": "https://github.com/RA7AN/Safesightv1",
    "tools": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "pgvector",
      "RAG",
      "Gemini",
      "Docker"
    ],
    "dateLabel": "Jul 2026",
    "highlights": [
      "Construction safety inspections, read by AI instead of memory.",
      "Designed and shipped the inspection pipeline end to end for the Kanz AI hackathon 2026.",
      "Grounded findings in OSHA, NEBOSH and company SOPs with pgvector retrieval, behind a provider-agnostic layer (Gemini, OpenRouter, Mistral, Ollama) so deployments can trade cost against privacy, with human review and PDF export at the end."
    ],
    "problem": "Site photos get captured but rarely analysed, and hazard calls lean on individual experience.",
    "sortOrder": 2,
    "isResearch": "no",
    "githubRepo": null
  },
  {
    "id": 1,
    "title": "KYC Automation using OCR and NER models",
    "url": "https://github.com/RA7AN/kyc-revent.git",
    "tools": [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Python",
      "PaddleOCR",
      "spaCy",
      "React",
      "REST APIs"
    ],
    "dateLabel": "Feb 2026",
    "highlights": [
      "KYC decisions from document upload to approve, review or reject, automated.",
      "Architected the platform: OCR extraction, weighted risk scoring and decision services.",
      "Designed weighted risk scoring engine combining identity matching, document completeness, financial strength, and document quality signals to generate automated approval, review, or rejection decisions."
    ],
    "problem": "Manual KYC review is slow, inconsistent and hard to audit at scale.",
    "sortOrder": 3,
    "isResearch": "no",
    "githubRepo": null
  },
  {
    "id": 2,
    "title": "Slack Export Utility: Organization-Wide Data Archival Tool",
    "url": "https://github.com/AbdulJ-7/Slack_Exporter.git",
    "tools": [
      "Python",
      "Slack API",
      "OAuth",
      "Bash CLI"
    ],
    "dateLabel": "Oct 2025",
    "highlights": [
      "Python-based internal utility built and authenticated with Slack APIs enabling secure export of Slack messages and media during platform migration.",
      "Enabled 150+ employees to securely archive critical operational data, preventing large-scale data loss due to administrative permission and ownership transfer issues.",
      "Produced technical documentation and walkthrough video enabling non-technical users to independently perform exports."
    ],
    "sortOrder": 4,
    "isResearch": "no",
    "showOnLanding": "no",
    "githubRepo": null
  },
  {
    "id": 3,
    "title": "AgentSmith: Multi-LLM AI Agent Hub",
    "url": "https://github.com/RA7AN/Tool_call_mirror",
    "tools": [
      "LangChain",
      "Streamlit",
      "GCP",
      "OpenAI",
      "Anthropic",
      "Gemini",
      "Llama",
      "SQLite"
    ],
    "dateLabel": "Jun 2025",
    "highlights": [
      "One hub orchestrating many LLMs into production-ready agents.",
      "Unified orchestration across 20+ APIs, from tool calls to multi-step workflows.",
      "Implemented persistent memory and dynamic context management."
    ],
    "problem": "Every model comes with its own tools, keys and quirks to babysit.",
    "sortOrder": 5,
    "isResearch": "no",
    "githubRepo": null
  },
  {
    "id": 4,
    "title": "MMVTG: Video Temporal Grounding",
    "url": "https://github.com/RA7AN/MMVTG_UI.git",
    "tools": [
      "PyTorch",
      "CLIP",
      "RAG",
      "Multi-Modal Learning"
    ],
    "dateLabel": "Sept 2024 - Mar 2025",
    "highlights": [
      "Retrieve the exact video segment a natural language query describes.",
      "Built the retrieval model: R1@0.5 of 60.5 and mAP of 61.55, past prior SOTA, published in IEEE.",
      "Paper accepted for publication in IEEE."
    ],
    "problem": "Finding one moment in hours of footage by hand does not scale.",
    "sortOrder": 6,
    "isResearch": "no",
    "githubRepo": null
  },
  {
    "id": 5,
    "title": "CogniConverse: Offline AI Assistant",
    "url": "https://github.com/RA7AN/CogniConverse/tree/model",
    "tools": [
      "Python",
      "FastAPI",
      "Transformer Models"
    ],
    "dateLabel": "Sept 2023",
    "highlights": [
      "Developed offline assistant improving agricultural accessibility.",
      "Model deployed on a remote server and made accessible to rural users through SMS.",
      "Selected as official entry to Smart India Hackathon 2023."
    ],
    "sortOrder": 7,
    "isResearch": "no",
    "showOnLanding": "no",
    "githubRepo": null
  }
]
