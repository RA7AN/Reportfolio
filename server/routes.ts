import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api, errorSchemas } from "@shared/routes";
import {
  education,
  experiences,
  honors,
  leadership,
  profile,
  projects,
  publications,
  skills,
  talks,
  writing,
} from "@shared/schema";
import { db } from "./db";
import { storage } from "./storage";

async function seedDatabase() {
  const [existingProfile] = await db.select().from(profile).limit(1);
  if (existingProfile) return;

  await db.insert(profile).values({
    fullName: "Abdul Jawwad",
    headline:
      "AI Research Engineer focused on multimodal learning, agentic systems, and evaluation.",
    location: "Jeddah, Makkah - 23342, Saudi Arabia",
    email: "hey.jawwad@gmail.com",
    phonePrimary: "+966 57 928 7411",
    phoneSecondary: "+91 70759 78540",
    linkedinUrl: "https://linkedin.com/in/abdul-jawwad-2ba58b23b",
    githubUrl: "https://github.com/RA7AN",
    orcidUrl: "https://orcid.org/0009-0008-1838-7713",
    objective:
      "Budding AI Researcher with experience in multi-modal learning, LLM agents, and evaluation frameworks. Seeking graduate research opportunities to contribute to advancing robust, reliable, and real-world effective AI systems, particularly in agentic AI, evaluation science, and multi-modal reasoning.",
  });

  await db.insert(experiences).values([
    {
      company: "Deccan AI",
      companyUrl: "https://www.deccan.ai",
      location: "Remote",
      role: "AI Research Engineer",
      startDate: "Dec 2024",
      endDate: "Present",
      highlights: [
        "Co-authored and launched Anthar Study Verified, benchmarking 6 AI coding agents across 43 real-world GitHub PRs.",
        "Led research pipelines covering dataset design, agent orchestration, RLHF/SFT workflows, annotation strategy, and evaluation systems.",
        "Developed internal tooling and evaluation frameworks using Python and LangGraph to accelerate research experimentation.",
      ],
    },
    {
      company: "MDS for Computer Systems",
      companyUrl: "https://mdscs.sa/",
      location: "Jeddah, Saudi Arabia",
      role: "Summer Intern",
      startDate: "Jun 2024",
      endDate: "Jul 2024",
      highlights: ["Configured and tested 8 network simulations using Cisco IOS."],
    },
    {
      company: "ACIC-CBIT",
      companyUrl: "https://acic-cbit.in/",
      location: "Hyderabad, India",
      role: "Research Intern",
      startDate: "Oct 2023",
      endDate: "Dec 2023",
      highlights: [
        "Conducted research studying educational motivation across rural schools involving 50+ students.",
      ],
    },
    {
      company: "Indian School of Business",
      companyUrl: "https://www.isb.edu/",
      location: "Hyderabad, India",
      role: "Digital Operations Intern",
      startDate: "Sept 2023",
      endDate: "Nov 2023",
      highlights: [
        "UNITE internship programme at Indian School of Business.",
        "Coordinated digital operations supporting placement of 200+ MBA graduates.",
      ],
    },
  ]);

  await db.insert(education).values([
    {
      institution: "Osmania University — Chaitanya Bharathi Institute of Technology",
      location: "Hyderabad, India",
      program: "B.E. in Computer Science and Engineering",
      startDate: "Dec 2021",
      endDate: "Apr 2025",
      details: ["GPA: 7.87/10"],
    },
    {
      institution: "International Indian School Jeddah",
      location: "Jeddah, Saudi Arabia",
      program: "Senior Secondary Education, CBSE",
      startDate: "Apr 2018",
      endDate: "Apr 2020",
      details: ["Percentage: 94.0%"],
    },
    {
      institution: "Al- Falah International School - DPS",
      location: "Jeddah, Saudi Arabia",
      program: "Secondary Education, CBSE",
      startDate: "Apr 2013",
      endDate: "Mar 2018",
      details: ["Percentage: 87.0%"],
    },
  ]);

  await db.insert(projects).values([
    {
      title: "KYC Automation using OCR and NER models",
      url: "https://github.com/RA7AN/kyc-revent.git",
      tools: [
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "Python",
        "PaddleOCR",
        "spaCy",
        "React",
        "REST APIs",
      ],
      dateLabel: "Feb 2026",
      highlights: [
        "Architected a full-stack KYC automation platform integrating OCR-based document extraction, risk scoring, NLP-based entity recognition, and automated decision workflows.",
        "Built modular microservices including OCR processing (Python + PaddleOCR), backend API (Node.js), and database-driven configuration system (PostgreSQL) enabling dynamic risk thresholds and scoring weights.",
        "Designed weighted risk scoring engine combining identity matching, document completeness, financial strength, and document quality signals to generate automated approval, review, or rejection decisions.",
      ],
    },
    {
      title: "Slack Export Utility: Organization-Wide Data Archival Tool",
      url: "https://github.com/AbdulJ-7/Slack_Exporter.git",
      tools: ["Python", "Slack API", "OAuth", "Bash CLI"],
      dateLabel: "Oct 2025",
      highlights: [
        "Python-based internal utility built and authenticated with Slack APIs enabling secure export of Slack messages and media during platform migration.",
        "Enabled 150+ employees to securely archive critical operational data, preventing large-scale data loss due to administrative permission and ownership transfer issues.",
        "Produced technical documentation and walkthrough video enabling non-technical users to independently perform exports.",
      ],
    },
    {
      title: "AgentSmith: Multi-LLM AI Agent Hub",
      url: "https://github.com/RA7AN/Tool_call_mirror",
      tools: ["LangChain", "Streamlit", "GCP", "OpenAI", "Anthropic", "Gemini", "Llama", "SQLite"],
      dateLabel: "Jun 2025",
      highlights: [
        "Built production-ready AI agent system supporting multiple LLMs with unified orchestration.",
        "Integrated 20+ APIs enabling complex multi-step automation workflows.",
        "Implemented persistent memory and dynamic context management.",
      ],
    },
    {
      title: "MMVTG: Multi-Modal Video Temporal Grounding",
      url: "https://github.com/RA7AN/MMVTG_UI.git",
      tools: ["PyTorch", "CLIP", "RAG", "Multi-Modal Learning"],
      dateLabel: "Sept 2024 - Mar 2025",
      highlights: [
        "Developed model retrieving precise video segments from natural language queries.",
        "Achieved R1@0.5 score of 60.5 and mAP of 61.55, surpassing prior SOTA.",
        "Paper accepted for publication in IEEE.",
      ],
    },
    {
      title: "CogniConverse: Offline AI Assistant",
      url: "https://github.com/RA7AN/CogniConverse/tree/model",
      tools: ["Python", "FastAPI", "Transformer Models"],
      dateLabel: "Sept 2023",
      highlights: [
        "Developed offline assistant improving agricultural accessibility.",
        "Model deployed on a remote server and made accessible to rural users through SMS.",
        "Selected as official entry to Smart India Hackathon 2023.",
      ],
    },
  ]);

  await db.insert(publications).values([
    {
      kind: "Blog",
      code: "B.1",
      year: "2025",
      title: "Anthar Study: Evaluating AI Coding Agents Beyond Benchmarks",
      venue: "Case study published online",
      url: "https://www.deccan.ai/research/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks",
    },
    {
      kind: "Conference",
      code: "C.1",
      year: "2025",
      title: "A Review on Cross Temporal Video Grounding and Moment Localization",
      venue:
        "Proceedings of the 2nd International Conference on Data Analytics and Intelligence Computing",
      url: "https://orcid.org/0009-0008-1838-7713",
    },
    {
      kind: "Journal",
      code: "J.1",
      year: "2025",
      title:
        "Cross-Attention-Based Intelligent Video Temporal Grounding for CCTV-Based Crime Identification in Smart Cities",
      venue: "Accepted for publication in IEEE",
      url: "https://orcid.org/0009-0008-1838-7713",
    },
    {
      kind: "Magazine",
      code: "M.1",
      year: "2022",
      title: "Do not gentle into that Moonlight",
      venue:
        "Guest Author article published in Transcendent Annual Newsletter, CBIT, Hyderabad, India",
      url: null,
    },
  ]);

  await db.insert(talks).values([
    {
      title: "Generative AI: Building with the OpenAI Playground",
      venue:
        "Guest Lecture and Technical Workshop at Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad, India",
      dateLabel: "Feb 2026",
    },
    {
      title: "A Review on Cross Temporal Video Grounding and Moment Localization",
      venue:
        "Paper Presentation at the 2nd International Conference on Data Analytics and Intelligence Computing (ICDAIC'25), Hyderabad, India",
      dateLabel: "Apr 2025",
    },
    {
      title:
        "Cross-Attention-Based Intelligent Video Temporal Grounding for CCTV-Based Crime Identification in Smart Cities",
      venue:
        "Paper Presentation at the 15th International Conference on Science and Innovative Engineering (ICSIE'25), Chennai, India",
      dateLabel: "Apr 2025",
    },
    {
      title:
        "PARE: Passion Assessment for Rural Educators Using Facial Recognition and Emotion Detection",
      venue: "Research Presentation at ACIC–CBIT (Atal Community Innovation Centre, CBIT), Hyderabad, India",
      dateLabel: "Dec 2023",
    },
  ]);

  await db.insert(skills).values([
    {
      category: "Programming Languages",
      items: ["Python", "C", "JavaScript", "SQL", "MySQL"],
    },
    {
      category: "Machine Learning & AI",
      items: [
        "PyTorch",
        "LangChain",
        "RLHF",
        "SFT",
        "RAG",
        "Multi-Modal Learning",
        "Agent Systems",
      ],
    },
    {
      category: "Cloud Technologies",
      items: ["Google Cloud Platform (GCP)"],
    },
    {
      category: "DevOps & Version Control",
      items: ["Git"],
    },
    {
      category: "Databases",
      items: ["SQLite", "PostgreSQL"],
    },
    {
      category: "Other Tools",
      items: ["LangGraph", "Label Studio", "VMware", "Cisco IOS"],
    },
    {
      category: "Research Skills",
      items: [
        "Experimental Design",
        "Benchmarking",
        "Evaluation Framework Design",
        "Dataset Creation",
      ],
    },
  ]);

  await db.insert(honors).values([
    {
      title: "Deccan Dynamite — Q3 2025",
      org: "Deccan AI",
      dateLabel: "May 2025",
      highlights: [
        "Awarded organization-wide recognition for exceptional research contributions, technical leadership, and positive client feedback on AI research and evaluation projects.",
      ],
    },
    {
      title: "Financial Leadership Award",
      org: "Toastmasters International, District 126",
      dateLabel: "Jun 2024",
      highlights: ["Awarded for leadership and financial management contributions."],
    },
    {
      title: "Toastmaster of the Quarter — Q1 2024",
      org: "Toastmasters International, District 126",
      dateLabel: "May 2024",
      highlights: [
        "Recognized for outstanding leadership, mentorship, and service contributions at club, area, and division levels, supporting multiple Toastmasters chapters and regional events.",
      ],
    },
    {
      title: "First Prize — Best Creative Article",
      org: "Transcendent CBIT",
      dateLabel: "Feb 2022",
      highlights: [
        "Awarded first place for excellence in journalistic writing, creativity, and narrative quality in a competitive literary event, Write Angle'22.",
      ],
    },
    {
      title: "Runner-Up — National Education Day Quiz Competition",
      org: "Indian Social Forum, Jeddah",
      dateLabel: "Nov 2017",
      highlights: [
        "Secured second place at regional-level academic quiz competition conducted on National Education Day, demonstrating excellence in general knowledge and academic aptitude.",
      ],
    },
  ]);

  await db.insert(leadership).values([
    {
      title: "Treasurer, Pathways Mentor, and Junior Coordinator",
      org: "Toastmasters CBIT — Toastmasters International, District 126",
      dateLabel: "Oct 2022 - Nov 2024",
      highlights: [
        "Served as elected Treasurer and Executive Committee member, overseeing budgeting, financial planning, funding allocation, and operational administration for club activities.",
        "Led ideation, planning, recruitment, public relations, and execution of regular meetings, workshops, and inter-club events, contributing to sustained membership growth and engagement.",
      ],
    },
  ]);

  await db.insert(writing).values([
    {
      title: "Anthar Study: Evaluating AI Coding Agents Beyond Benchmarks",
      kind: "case-study",
      source: "Deccan AI Research",
      publishedAt: "2025",
      url: "https://www.deccan.ai/research/anthar-study-evaluating-ai-coding-agents-beyond-benchmarks",
      summary:
        "A case study evaluating AI coding agents on real-world pull requests, emphasizing reliability beyond benchmark scores.",
      contentMd: null,
      tags: ["agents", "evaluation", "research"],
    },
    {
      title: "Do not gentle into that Moonlight",
      kind: "article",
      source: "Transcendent Annual Newsletter",
      publishedAt: "2022",
      url: null,
      summary:
        "A guest-author piece exploring resilience and creative narrative in a literary newsletter.",
      contentMd:
        "## Do not gentle into that Moonlight\n\nThis piece was published in *Transcendent* (CBIT). If you'd like, I can expand this page with the full text once you provide it.",
      tags: ["writing", "literature"],
    },
  ]);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedDatabase();

  app.get(api.portfolio.get.path, async (_req, res) => {
    const data = await storage.getPortfolio();
    res.json(data);
  });

  app.get(api.writing.list.path, async (req, res) => {
    const input = api.writing.list.input?.safeParse(req.query);
    const params = input?.success ? input.data : undefined;
    const list = await storage.getWritingList(params);
    res.json(list);
  });

  app.get(api.writing.get.path, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(404).json({ message: "Not found" });
    }

    const item = await storage.getWriting(id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(item);
  });

  app.post(api.writing.create.path, async (req, res) => {
    try {
      const body = api.writing.create.input.parse(req.body);
      const created = await storage.createWriting(body);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      return res.status(500).json({ message: "Internal error" });
    }
  });

  // Basic error handler response shape consistency
  app.use((err: unknown, _req: unknown, res: any, _next: any) => {
    console.error(err);
    res.status(500).json(errorSchemas.internal.parse({ message: "Internal error" }));
  });

  return httpServer;
}
