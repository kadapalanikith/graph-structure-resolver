# Deployment Guide

This guide covers deploying the MERN stack application (Node.js/Express Backend and React/Vite Frontend) for the SRM Full Stack Challenge.

## 1. Backend Deployment (Render)

We recommend using **Render** as it natively supports Node.js web services and easily handles standard Express servers.

### Prerequisites:
- Push your entire code repository to GitHub.
- Create an account on [Render](https://render.com/).

### Steps for Render:
1. Go to your Render Dashboard and click **New** -> **Web Service**.
2. Connect your GitHub account and select this repository.
3. Configure the Web Service:
   - **Name**: `bajaj-backend` (or any preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Expand **Advanced** and add Environment Variables:
   - `PORT`: `5000` (Render sets this automatically, but you can override it)
5. Click **Create Web Service**. Wait for the build to finish.
6. Once deployed, copy the live URL (e.g., `https://bajaj-backend-xxxx.onrender.com`). You'll need it for the frontend.

---

## 2. Frontend Deployment (Vercel)

We recommend using **Vercel** for fast React + Vite deployments.

### Prerequisites:
- Ensure your backend is deployed and you have its live URL.
- Create an account on [Vercel](https://vercel.com/).

### Steps for Vercel:
1. Go to your Vercel Dashboard and click **Add New** -> **Project**.
2. Connect your GitHub account and import your repository.
3. Configure the Project:
   - **Project Name**: `bajaj-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Click 'Edit' and select the `frontend` folder).
4. Expand **Environment Variables** and add your Backend API URL:
   - **Name**: `VITE_API_URL`
   - **Value**: `<YOUR_BACKEND_RENDER_URL>/bfhl` (e.g., `https://bajaj-backend-xxxx.onrender.com/bfhl`)
5. Click **Deploy**. Vercel will run `npm install` and `npm run build` automatically based on the `package.json` inside the frontend directory.
6. Once completed, your frontend will be live and accessible via the provided Vercel URL.

---

## 3. Local Development Testing

If you wish to test locally before deployment:

**Backend:**
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:5000`)*

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

Remember to test the interactions! In local development, the frontend falls back to `http://localhost:5000/bfhl` automatically if `VITE_API_URL` is not provided.
