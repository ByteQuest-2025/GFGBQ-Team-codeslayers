# 🏥 Clinical Compass - CDSS (Clinical Decision Support System)

> **Team Name:** Codeslayers  
> **Problem Statement:** [P-04]

<div align="center">

[![Deployed App](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge&logo=vercel)](https://cdss-theta.vercel.app/)
[![Presentation](https://img.shields.io/badge/Presentation-View_Slides-yellow?style=for-the-badge&logo=google-slides)](https://docs.google.com/presentation/d/1LJyb6tKDIkoUxl77by_l7OYrnCaaI-qa/edit?usp=sharing&ouid=105275889791132121591&rtpof=true&sd=true)
[![Demo Video](https://img.shields.io/badge/Video_Demo-Watch_Now-red?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/1Dn2qJ0n9_bnp2soqzdsXmQhH6S1Wu-br/view?usp=sharing)

</div>

---

## 📖 Project Overview

**Clinical Compass** is a state-of-the-art **Clinical Decision Support System (CDSS)** designed to assist medical professionals in making data-driven diagnoses. By leveraging advanced AI and real-time patient data analysis, it provides accurate clinical insights, treatment recommendations, and interactive visualizations.

The system utilizes machine learning techniques to:
- Identify relevant disease patterns.
- Support differential diagnosis.
- Highlight potential health conditions based on medical history, symptoms, and lab results.

---

## 🚀 Key Features

### 🤖 AI-Powered Clinical Analysis
Utilizes the **Gemini 2.5 Flash model** (via Google Generative AI) to analyze patient symptoms, vitals, and history, offering potential diagnoses and detailed treatment pathways.

### 💬 Interactive Chat Assistant
A premium, doctor-friendly chat interface that allows medical professionals to:
- 🩺 Ask follow-up questions about diagnoses.
- 📉 View "Vital Trends" with interactive graphs.
- 📚 Access relevant clinical guidelines and citations in a dedicated sidebar.
- 📄 Export consultation records as PDF/documents.

### 📊 Dynamic Data Visualization
Real-time graphical representation of patient vitals (Heart Rate, Temperature, BP, etc.) to easily track trends over time and monitor patient stability.

### 📝 Comprehensive Patient Intake
Streamlined, intuitive forms for capturing essential patient demographics, presenting symptoms, and detailed medical history.

### 🛡️ Secure & Scalable
Built with modern web standards, ensuring reliability, speed, and best practices for clinical software.

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **AI Engine** | Google Gemini API (2.5 Flash) |
| **Visualization**| [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📸 Screenshots

<div align="center">
  <img width="100%" alt="Dashboard Overview" src="https://github.com/user-attachments/assets/a908eab5-0183-4303-995d-a9b24257ab07" />
  <br/><br/>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <img width="48%" alt="Patient Intake" src="https://github.com/user-attachments/assets/aaaf474c-0085-417e-abf1-56b5b806bc01" />
    <img width="48%" alt="AI Analysis" src="https://github.com/user-attachments/assets/4bc9b282-f86b-4956-86a0-93ba69a06a16" />
    <img width="48%" alt="Chat Interface" src="https://github.com/user-attachments/assets/3c44b85f-8534-44c0-844d-98add56f726d" />
    <img width="48%" alt="Treatment Plan" src="https://github.com/user-attachments/assets/acd3d22f-c5fa-4972-a051-566fd7288a08" />
  </div>
</div>

---

## 📦 Installation & Setup

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/ByteQuest-2025/GFGBQ-Team-codeslayers/
cd clinical-compass
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🎮 Usage Instructions

1.  **Start the Application**: 
    Once the server is running, navigate to `http://localhost:8080

2.  **Patient Data Entry**:
    Fill out the **Patient Intake Form** with demographics, symptoms, and medical history.

3.  **AI-Powered Analysis**:
    Submit the form. The AI will analyze the data and display:
    - Potential Differential Diagnoses (ranked by confidence).
    - Recommended Tests.
    - Clinical Reasoning.
    - Treatment Pathways.

4.  **Interactive Chat**:
    Use the chat interface to ask questions like:
    - *"Explain the treatment plan rationale"*
    - *"Show related clinical guidelines"*

5.  **Review Findings**:
    Explore the tabs for **Diagnosis**, **Reasoning**, **Tests**, and **Treatment** for a comprehensive view.

---

## 👥 Contributors

| Name | GitHub Profile |
|------|----------------|
| **Saurav Singh** | [![GitHub](https://img.shields.io/badge/GitHub-View_Profile-black?logo=github)](https://github.com/saurav-shakya) |
| **Ansh** | [![GitHub](https://img.shields.io/badge/GitHub-View_Profile-black?logo=github)](https://github.com/Ansh-Saraswat-PC) |

---

## 📄 License

This project is intended for **educational and clinical decision support research purposes**. 

> **Disclaimer:** Always verify AI suggestions with qualified medical professionals. This tool provides support, not final medical decisions.
