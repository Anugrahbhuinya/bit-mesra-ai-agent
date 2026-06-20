# 🎓 BIT Mesra AI Assistant

An AI-powered campus assistant for **Birla Institute of Technology, Mesra** that helps students access academic information, campus resources, notices, hostel details, departments, clubs, and locations through a conversational interface.

Built using **FastAPI**, **React**, **MongoDB**, **ChromaDB**, **LangChain**, and **Retrieval-Augmented Generation (RAG)**.

---

## 🚀 Features

### 💬 AI Chat Assistant

* Conversational campus assistant
* Natural language query support
* Context-aware responses
* MongoDB chat history storage
* Session-based conversations

### 📚 Academic Information

* Academic Calendar Search
* Examination Schedule Lookup
* Quiz and Registration Dates
* Academic Notices

### 📢 Notice Management

* Scholarship Notices
* Placement Notices
* Academic Announcements
* Student Activity Notifications

### 🏢 Campus Information

* Buildings Information
* Facilities Information
* Hostel Information
* Department Information
* Student Clubs Information

### 🗺️ Smart Campus Navigation

* Interactive Campus Map
* Open Location on Map
* Auto Fly-To Location
* Location Search

### 🎙️ Voice Features

* Voice Input
* Voice Output
* Speech-to-Text
* Text-to-Speech

### 🧠 Retrieval-Augmented Generation (RAG)

* ChromaDB Vector Database
* HuggingFace Embeddings
* Semantic Search
* Intent-Aware Retrieval
* Metadata Filtering
* Confidence-Based Ranking

---

# 🏗️ System Architecture

```text
User Query
     │
     ▼
FastAPI Backend
     │
     ▼
Intent Detection
     │
     ▼
RAG Retrieval (ChromaDB)
     │
     ├── FAQs
     ├── Academic Calendar
     ├── Notices
     ├── Buildings
     ├── Facilities
     ├── Hostels
     ├── Departments
     └── Clubs
     │
     ▼
Response Generation
     │
     ▼
React Frontend
```

---

# 🧠 RAG Pipeline

```text
JSON Data
    │
    ▼
Chunking
    │
    ▼
HuggingFace Embeddings
(BAAI/bge-small-en-v1.5)
    │
    ▼
ChromaDB
    │
    ▼
Similarity Search
    │
    ▼
Intent Routing
    │
    ▼
Source-Aware Ranking
    │
    ▼
Answer
```

---

# 📂 Project Structure

```text
bit-mesra-ai-agent/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── rag/
│   │   │   ├── search/
│   │   │   ├── history/
│   │   │   └── map/
│   │   └── database/
│   │
│   ├── chroma_db/
│   └── scripts/
│
├── data/
│   ├── academics/
│   ├── notices/
│   ├── maps/
│   ├── hostel/
│   ├── clubs/
│   └── faqs/
│
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Leaflet
* Web Speech API

## Backend

* FastAPI
* Python
* MongoDB
* Pydantic

## AI & RAG

* LangChain
* ChromaDB
* HuggingFace Embeddings
* BAAI/bge-small-en-v1.5

---

# 📊 Current Knowledge Base

| Source            | Documents |
| ----------------- | --------: |
| FAQs              |       100 |
| Academic Calendar |         6 |
| Notices           |        20 |
| Buildings         |        15 |
| Facilities        |        10 |
| Hostels           |         8 |
| Departments       |        10 |
| Clubs             |        10 |
| **Total**         |   **179** |

---

# 🔍 Example Queries

### Buildings

```text
Where is the Central Library?
```

### Hostels

```text
Tell me about Aryabhatta Hostel
```

### Departments

```text
Which department offers AIML?
```

### Facilities

```text
Medical Center
```

### Clubs

```text
What clubs are available?
```

### Notices

```text
Scholarship Notice
```

### Academic Calendar

```text
When is Quiz1?
```

---

# ⚡ Installation

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📈 Current Progress

### Phase 1

* [x] Data Collection
* [x] FAQ Dataset
* [x] Academic Calendar Dataset
* [x] Notices Dataset
* [x] Buildings Dataset
* [x] Facilities Dataset
* [x] Hostels Dataset
* [x] Departments Dataset
* [x] Clubs Dataset

### Phase 2

* [x] ChromaDB Integration
* [x] Embedding Pipeline
* [x] Chunking Pipeline
* [x] Semantic Search
* [x] Metadata Filtering
* [x] Intent Routing

### Phase 3

* [x] FastAPI Integration
* [x] MongoDB Chat History
* [x] RAG Integration
* [x] Voice Features
* [x] Campus Map

### Phase 4 (In Progress)

* [ ] Gemini Integration
* [ ] Conversational RAG
* [ ] Context-Aware Responses
* [ ] Personalized Student Assistance

---

# 👨‍💻 Author

**Anugrah Bhuinya Munda**

B.Tech Artificial Intelligence & Machine Learning
Birla Institute of Technology, Mesra

GitHub: https://github.com/Anugrahbhuinya

---

# ⭐ Future Enhancements

* Gemini-powered Conversational AI
* Attendance Calculator
* ERP Integration
* Personalized Academic Assistant
* Student Dashboard
* Event Recommendations
* Campus Navigation Assistant
* Multi-language Support
