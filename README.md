# 🥛 Dairy Admin Frontend (`Dairy-Adm-frontend`)

Modern, dynamic React web dashboard for the Dairy Marketplace administration portal built with **React**, **Vite**, and **TypeScript**.

- **GitHub Repository:** [https://github.com/MaheshKumarBisai/Dairy-Adm-frontend.git](https://github.com/MaheshKumarBisai/Dairy-Adm-frontend.git)
- **Default Port:** `3001`

---

## 📋 Prerequisites
Before running on a new laptop, ensure:
1. **Node.js**: `v20.x` or higher (`node -v`)
2. **npm**: `v10.x` or higher (`npm -v`)
3. **Admin Backend**: Running on `http://localhost:4001`
4. **Git**: Installed (`git --version`)

---

## ⚡ Step-by-Step Local Setup Guide

Run these commands in order in your terminal:

### 1. Clone the Repository
```bash
git clone https://github.com/MaheshKumarBisai/Dairy-Adm-frontend.git
cd Dairy-Adm-frontend
```

### 2. Setup Environment Variables
Create your local `.env` configuration file from the template:
```bash
cp .env.example .env
```

Default settings in `.env`:
```env
VITE_ADMIN_BACKEND_URL=http://localhost:4001
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

The Admin Frontend portal is now live at **http://localhost:3001**!

---

## 🛠 Available Scripts
- `npm run dev`: Start Vite development server on port 3001.
- `npm run build`: Compile and build production bundle to `dist/`.
- `npm run preview`: Preview the production build locally.
