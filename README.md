# Problem Statement [P-04]

Develop an AI-powered diagnostic support system designed to assist doctors in
clinical decision-making by analyzing patient data, including medical history,
reported symptoms, and laboratory results. The system leverages machine
learning techniques to identify relevant disease patterns, support differential
diagnosis, and highlight potential health conditions.

# Project Name

**Clinical Compass**

# Team Name

**Codeslayers**

## Deployed Link

https://cdss-theta.vercel.app/

## Demonstration Video Link

[https://drive.google.com/file/d/1Dn2qJ0n9_bnp2soqzdsXmQhH6S1Wu-br/view?usp=sharing]

## Presentation Link

[https://docs.google.com/presentation/d/1LJyb6tKDIkoUxl77by_l7OYrnCaaI-qa/edit?usp=sharing&ouid=105275889791132121591&rtpof=true&sd=true]

# Project Overview

Clinical Compass is a state-of-the-art Clinical Decision Support System designed to assist medical professionals in making data-driven diagnoses. By leveraging advanced AI and real-time patient data analysis, it provides accurate clinical insights, treatment recommendations, and interactive visualizations.

## 🚀 Features

- **🤖 AI-Powered Clinical Analysis**  
  Utilizes the Gemini 2.5 Flash model (via Google Generative AI) to analyze patient symptoms, vitals, and history, offering potential diagnoses and treatment plans.

- **💬 Interactive Chat Assistant**  
  A premium, doctor-friendly chat interface that allows medical professionals to:
  - Ask follow-up questions about diagnoses.
  - View "Vital Trends" with interactive graphs.
  - Access relevant clinical guidelines and citations in a dedicated sidebar.
  - Export consultation records as PDF/documents.

- **📊 Dynamic Data Visualization**  
  Real-time graphical representation of patient vitals (Heart Rate, Temperature, etc.) to easily track trends over time.

- **📝 Comprehensive Patient Intake**  
  Streamlined forms for capturing essential patient demographics, symptoms, and medical history.

- **🛡️ Secure & Scalable**  
  Built with modern reliability and best practices for clinical software.

## 🛠️ Technology Stack

- **Frontend Core**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **AI Engine**: Google Gemini API
- **Icons**: Lucide React
- **Charts**: Recharts
- **Markdown Rendering**: react-markdown & remark-gfm

# 📦 Installation & Setup

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByteQuest-2025/GFGBQ-Team-codeslayers/
   cd clinical-compass
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

# Usage Instructions

1. **Start the Application**: 
Once the development server is running, open your web browser and navigate to http://localhost:5173 (or the port specified in your console).

2. **Patient Data Entry**:

Begin by filling out the Patient Intake Form.
Enter the patient's demographics, presenting symptoms, medical history, and latest vital signs.

3. **AI-Powered Analysis**:

After submitting the form, the AI assistant will process the information to generate a preliminary analysis.
The main dashboard will update to display potential diagnoses, graphical trends of vital signs, and a recommended treatment pathway.

4. **Interactive Chat**:

Use the chat interface to ask follow-up questions and gain deeper insights. For example, you can ask:
"Explain the treatment plan rationale"
"What are the alternative diagnoses?"
"Show related clinical guidelines"
"Risk factors analysis"

5. **Review Detailed Panels**:

Explore the different panels on the dashboard to view Recommended Tests, the AI's Clinical Reasoning, and a list of References or citations that support the conclusions.

# Screenshots 

<img width="1361" height="634" alt="Screenshot 2026-01-04 105513" src="https://github.com/user-attachments/assets/a908eab5-0183-4303-995d-a9b24257ab07" />
<img width="1365" height="639" alt="Screenshot 2026-01-04 105459" src="https://github.com/user-attachments/assets/4bc9b282-f86b-4956-86a0-93ba69a06a16" />
<img width="1365" height="641" alt="Screenshot 2026-01-04 105441" src="https://github.com/user-attachments/assets/3c44b85f-8534-44c0-844d-98add56f726d" />
<img width="1364" height="630" alt="Screenshot 2026-01-04 105425" src="https://github.com/user-attachments/assets/acd3d22f-c5fa-4972-a051-566fd7288a08" />
<img width="1362" height="635" alt="Screenshot 2026-01-04 105335" src="https://github.com/user-attachments/assets/24dfc896-b459-4045-929c-c2e98fcc9ef8" />
<img width="1326" height="621" alt="Screenshot 2026-01-04 105033" src="https://github.com/user-attachments/assets/aaaf474c-0085-417e-abf1-56b5b806bc01" />
<img width="1326" height="621" alt="Screenshot 2026-01-04 105033" src="https://github.com/user-attachments/assets/dc2187fa-36f0-4a52-93aa-3a4f13caffb6" />
<img width="1329" height="619" alt="Screenshot 2026-01-04 104952" src="https://github.com/user-attachments/assets/7090495e-085e-46b4-83fb-4856b8bd639d" />
<img width="1329" height="620" alt="Screenshot 2026-01-04 104942" src="https://github.com/user-attachments/assets/e1fdafda-6640-4ae5-b659-dc7f252e10fd" />
<img width="1329" height="613" alt="Screenshot 2026-01-04 104928" src="https://github.com/user-attachments/assets/cb27efe8-f2c0-449d-9737-49db3d5780b0" />
<img width="613" height="483" alt="Screenshot 2026-01-03 185950" src="https://github.com/user-attachments/assets/7c7c9bab-a214-4bd7-8894-cbedb339fc2e" />


## 👥 Contributors

<<<<<<< HEAD
=======

>>>>>>> 6a35ad7a7b0fecc67777ec7db9ff6a2a20b75226
| Name | GitHub Profile |
|------|----------------|
| **Saurav Singh** | [View Profile](https://github.com/saurav-shakya) |
| **Ansh** | [View Profile](https://github.com/Ansh-Saraswat-PC) |

## 📄 License

This project is intended for educational and clinical decision support research purposes. Always verify AI suggestions with qualified medical professionals.
