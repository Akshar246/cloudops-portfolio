# CloudOps Portfolio Hub

## 🔗 Live Demo & Repository

* 🌐 **Live Demo (Production):** *(https://cloudops-portfolio-2t5g.vercel.app/)*
---

A **cloud-based, production-style portfolio platform** built to **apply AWS cloud concepts in a real system**, not just demonstrate UI or coursework. This project is actively evolving and represents my hands-on journey from learning cloud fundamentals to **designing, integrating, and operating cloud-backed applications**.

---

## 🚀 Project Pitch (Why This Exists)

Most portfolios only *display* skills. **CloudOps Portfolio Hub validates them.**

This project was built to:

* Implement AWS services inside a real, live web application
* Translate AWS theory (Educate / Skill Builder / SimuLearn) into practice
* Demonstrate cloud security, access control, and cost awareness
* Provide recruiters with **verifiable proof**, not just claims

It is intentionally designed like an **internal engineering tool**, not a static showcase website.

---

## 🎯 What This Platform Does

CloudOps Portfolio Hub allows me to:

* Manage and showcase **projects, certifications, labs, and job simulations**
* Upload and store proof files (PDFs, screenshots) securely in the cloud
* Control **public vs private visibility** of portfolio content
* Share a recruiter-friendly public view backed by real cloud infrastructure

---

## 🏗️ Architecture Overview

### High-Level Flow

* Recruiters / visitors access the public portfolio
* Admin (me) manages content through the application
* Portfolio metadata is handled by the application layer
* Proof files are stored in Amazon S3
* AWS IAM controls access between the application and cloud resources

This separation ensures **security, scalability, and clean system design**.

---

## 🧱 Architecture Components (Detailed)

### 1️⃣ Client Layer

* Public users can browse approved portfolio content
* Admin can create, update, and manage entries
* Focused on clarity, performance, and recruiter readability

### 2️⃣ Application Layer (Next.js)

* Built using **Next.js** (not plain React)
* Handles UI rendering and backend logic
* Manages portfolio CRUD operations
* Orchestrates file upload workflows
* Enforces visibility rules (public vs private)

### 3️⃣ Object Storage Layer (Amazon S3)

* All proof artifacts (certificates, screenshots, badges) are stored in S3
* Provides durable, scalable object storage
* Decouples file storage from the web application
* Designed to scale without architectural changes

### 4️⃣ Security Layer (AWS IAM)

* IAM roles and policies control access to S3
* Application is granted **least-privilege permissions only**
* No public write access to buckets
* Prevents accidental exposure of sensitive assets

---

## 🧰 Tech Stack

### Application

* **Next.js** – Full-stack framework (UI + backend logic)
* **Node.js** – Server-side runtime
* **REST APIs** – Data management and workflows
* **JWT Authentication** – Secure access control
* **Git & GitHub** – Version control and collaboration

### Cloud & DevOps (Actively Used)

* **Amazon S3** – Secure object storage for portfolio proofs
* **AWS IAM** – Access control and security boundaries
* **Live Deployment** – Publicly accessible application

> ⚠️ Only services that are actually implemented are listed. No buzzwords.

---

## ☁️ AWS Implementation (Hands-On Details)

This project actively uses AWS services, not mock setups:

* Designed S3 bucket structure for organized proof storage
* Implemented upload and retrieval of files from S3
* Applied IAM policies following least-privilege principles
* Separated public metadata from private assets
* Considered AWS cost impact at every decision point

The goal was to **treat AWS as production infrastructure**, not a lab exercise.

---

## 🔐 Security Considerations

* No hardcoded secrets in the client
* No public write permissions on S3
* IAM policies scoped only to required actions
* Clear separation of responsibilities between app and storage
* Portfolio visibility rules enforced at application level

---

## 💰 Cost Awareness

This project was built with **student credits and free-tier awareness**:

* Avoided services with fixed or hidden recurring costs
* No NAT Gateways, Load Balancers, or always-on heavy resources
* Chose simple, scalable services that can evolve later
* Designed architecture to remain cost-safe while learning

---

## 📸 Proof & Verification

This project is **verifiable**, not theoretical:

* Live deployed website
* AWS S3 buckets with real stored assets
* IAM configurations (sanitized screenshots)
* Execution evidence instead of static screenshots

Recruiters can clearly see how cloud services are used.

---

## 🧠 Key Skills Demonstrated

* Cloud computing fundamentals (AWS)
* Identity and Access Management (IAM)
* Secure file storage and access control
* Backend API design
* Production-style system thinking
* Cost-aware cloud decision making

---

## 🧠 Key Learnings

* How cloud theory translates into real systems
* IAM complexity and access boundaries in practice
* Designing systems with security and cost in mind
* Treating personal projects like production systems

---

## 🔮 Current Status & Future Improvements

**Status:** Actively improving and extending

Planned enhancements:

* CloudFront for optimized asset delivery
* Pre-signed URLs for improved upload security
* CloudWatch for logging and monitoring
* Infrastructure diagrams and automation

---

## 👤 Author

**Akshar Chanchlani**
Aspiring Cloud / Software Engineer

This project represents my transition from learning cloud concepts to **building and operating real cloud-backed systems**.

---
