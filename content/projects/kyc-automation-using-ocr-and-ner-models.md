---
type: "project"
slug: "kyc-automation-using-ocr-and-ner-models"
sortOrder: 1
lastUpdated: "2026-02-12T17:33:53.008Z"
---

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
    "Architected a full-stack KYC automation platform integrating OCR-based document extraction, risk scoring, NLP-based entity recognition, and automated decision workflows.",
    "Built modular microservices including OCR processing (Python + PaddleOCR), backend API (Node.js), and database-driven configuration system (PostgreSQL) enabling dynamic risk thresholds and scoring weights.",
    "Designed weighted risk scoring engine combining identity matching, document completeness, financial strength, and document quality signals to generate automated approval, review, or rejection decisions."
  ],
  "sortOrder": 1,
  "isResearch": "no",
  "githubRepo": null,
  "slug": "kyc-automation",
  "oneLiner": "OCR, NER, and risk scoring for automated KYC decisions.",
  "featured": true,
  "featuredOrder": 4,
  "kind": "project",
  "cardTags": ["OCR", "NER", "Risk Assessment"],
  "demoUrl": null,
  "paperUrl": null,
  "sections": [
    {
      "id": "problem",
      "title": "The problem",
      "body": "KYC review mixes document extraction, identity signals, and risk decisions that are slow to do by hand."
    },
    {
      "id": "approach",
      "title": "Approach",
      "body": "OCR-based document extraction, NER, and a weighted risk scoring engine for automated approval, review, or rejection."
    },
    {
      "id": "system",
      "title": "System",
      "body": "Modular services: OCR (Python + PaddleOCR), backend API (Node.js), PostgreSQL-backed configuration for thresholds and weights."
    }
  ]
}