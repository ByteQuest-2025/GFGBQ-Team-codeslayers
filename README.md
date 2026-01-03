# Clinical Compass - Intelligent Clinical Decision Support System (CDSS)

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

## 📦 Installation & Setup

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

## 👥 Contributors

| Name | GitHub Profile |
|------|----------------|
| **Saurav Singh** | [View Profile](https://github.com/saurav-shakya) |
| **Ansh** | [View Profile](https://github.com/Ansh-Saraswat-PC) |

## 📄 License

This project is intended for educational and clinical decision support research purposes. Always verify AI suggestions with qualified medical professionals.
