# AgriNexus AI — Frontend

Modern, responsive web frontend for **AgriNexus AI** (Intelligent Farm Advisory & Agricultural Management Platform), built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## 🌾 Features

- **Farmer Dashboard:** Overview of farm holdings, active crops, weather advisories, and quick actions.
- **Crop Disease Scanner:** MobileNetV2-powered real-time plant disease detection from leaf imagery with diagnostic confidence and treatment recommendations.
- **RAG Agricultural Assistant:** Conversational AI advisor grounded in verified agronomic knowledge base documents.
- **Farm & Crop Management:** Interactive management of farms, soil types, planting schedules, and crop cycles.
- **Expert Advisory Portal:** Q&A workflow connecting farmers directly with certified agricultural specialists.
- **Role-Based Access Control:** Secure JWT authentication and role-tailored dashboards (`ROLE_FARMER`, `ROLE_EXPERT`, `ROLE_ADMIN`).

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/) with JWT interceptors
- **Linting:** [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Sumitrayka08/AgriNexus-AI-Frontend.git
cd AgriNexus-AI-Frontend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` or `.env.local` file in the root directory:
```env
VITE_API_BASE_URL=https://backend-s38r.onrender.com/api
```
*(For local development with a local backend, set `VITE_API_BASE_URL=http://localhost:8080/api`)*

### 4. Development & Build Scripts
```bash
# Start local development server (with HMR)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

---

## 🌐 Production Deployments

- **Vercel:** [https://agrinexus-ai-frontend.vercel.app](https://agrinexus-ai-frontend.vercel.app)
- **Netlify:** [https://agrinexus-ai.netlify.app](https://agrinexus-ai.netlify.app)
- **Production Backend API:** [https://backend-s38r.onrender.com/api](https://backend-s38r.onrender.com/api)
- **Plant Disease AI Microservice:** [https://agrinexus-ai-service.onrender.com](https://agrinexus-ai-service.onrender.com)

---

## 📄 License
This project is part of the AgriNexus AI Agricultural Advisory & Management Platform.
