# 🎓 BIT Mesra AI Assistant

> An enterprise-grade AI-powered digital campus assistant for **BIT Mesra**, built using **FastAPI, React, Gemini 2.5 Flash, LangChain, ChromaDB, and MongoDB**.

The assistant provides intelligent campus search, hybrid Retrieval-Augmented Generation (RAG), dynamic knowledge management, automatic website synchronization, and an enterprise administration portal.

---

# 🚀 Features

## 🔍 Universal Campus Search

* FAQs
* Academic Calendar
* Notices
* Buildings
* Departments
* Hostels
* Facilities
* Clubs
* Intelligent Intent Detection

---

## 💬 AI Chat Assistant

* Gemini 2.5 Flash
* Hybrid RAG
* MongoDB Conversation Memory
* Context-aware Responses
* Follow-up Question Handling
* Source Citations
* Chat History
* Session Management

---

## 📚 Dynamic Knowledge Base

### PDF Knowledge Base

* Secure PDF Upload
* Automatic Text Extraction
* Intelligent Chunking
* Embedding Generation
* Dynamic ChromaDB Indexing
* Duplicate Detection (SHA-256)
* Delete Documents
* Re-index Documents
* Live Knowledge Updates
* Source Citations

### Website Knowledge Base

* Website URL Validation
* Intelligent HTML Extraction
* Metadata Extraction
* Website-to-Chroma Pipeline
* Duplicate Detection
* Dynamic Website Indexing
* Website Source Citations
* Manual Re-indexing

---

## 🔄 Automatic Website Synchronization

* Background Scheduler
* Automatic Website Crawling
* Intelligent Change Detection
* Incremental Re-indexing
* Normalized Content Hashing
* Crawl History
* Manual Sync
* Bulk Sync
* Production Logging
* Crawl Monitoring

---

## 🛠 Enterprise Admin Console

* JWT Authentication
* Analytics Dashboard
* Knowledge Base Dashboard
* Document Management
* Website Management
* Crawl History
* Activity Logs
* Settings
* Responsive Modern UI

---

# 🏗 Architecture

```text
                        User
                          │
                          ▼
                  React + TypeScript
                          │
                    FastAPI Backend
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
   Universal Search   Hybrid RAG      Admin Console
        │                 │                  │
        │                 ▼                  │
        │         Gemini 2.5 Flash           │
        │                 │                  │
        ▼                 ▼                  ▼
     MongoDB         ChromaDB          Knowledge Manager
                          ▲
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
 PDF Ingestion                    Website Ingestion
        │                                   │
        ▼                                   ▼
  Chunking + Embeddings      Chunking + Embeddings
        │                                   │
        └──────────────► Shared Vector Store ◄──────────────┐
                                                            │
                                                Auto Website Sync
                                                            │
                                                            ▼
                                                Incremental Updates
```

---

# ⚙️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Framer Motion
* React Router
* Lucide Icons

## Backend

* FastAPI
* Python
* MongoDB
* ChromaDB
* LangChain
* HuggingFace Embeddings
* Google Gemini 2.5 Flash
* JWT Authentication
* BeautifulSoup
* Background Scheduler

---

# 🧠 AI Pipeline

```text
User Query
      │
      ▼
Intent Detection
      │
      ▼
Hybrid Retriever
      │
      ▼
ChromaDB
      │
      ▼
Context Builder
      │
      ▼
Gemini 2.5 Flash
      │
      ▼
Grounded Response
      │
      ▼
Source Citations
```

---

# 🌐 Knowledge Synchronization

```text
Website
      │
      ▼
Scheduler
      │
      ▼
Crawler
      │
      ▼
Content Extraction
      │
      ▼
Normalized Hash
      │
      ▼
Meaningful Change?
      │
   ┌──┴──┐
   │     │
 No      Yes
   │     │
   ▼     ▼
Update   Re-index
Metadata Embeddings
```

---

# ✅ Completed Phases

* Phase 1 – Universal Search
* Phase 2 – Chat History
* Phase 3 – Hybrid RAG
* Phase 4 – Gemini Integration
* Phase 5A – Enterprise Admin Dashboard
* Phase 5B – Dynamic PDF Knowledge Base
* Phase 6A – Website Knowledge Ingestion
* Phase 6B – Automatic Website Synchronization

---

# 🚧 Next Phase

## Phase 7 – Authentication & Personalized Student Platform

Planned Features

* Student Authentication
* JWT Access Tokens
* Role-Based Access Control
* Student Profiles
* Personalized AI Context
* Timetable Integration
* Attendance Management
* Personalized Notices
* Future ERP Integration

---

# 📸 Screenshots

* AI Chat Assistant
* Admin Dashboard
* Knowledge Base
* Document Management
* Website Management
* Crawl History
* Analytics

---

# ⭐ Highlights

* Hybrid Retrieval-Augmented Generation (RAG)
* Dynamic PDF & Website Knowledge Base
* Automatic Website Synchronization
* Intelligent Change Detection
* Enterprise Admin Dashboard
* Production-grade FastAPI Architecture
* Modern React + TypeScript Frontend
* Source-aware AI Responses
* Modular & Scalable Design

---

# 📄 License

This project is developed for educational purposes as part of the **BIT Mesra AI Assistant** initiative.
