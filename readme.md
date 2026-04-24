# Bajaj - SRM Full Stack Engineering Challenge 🚀

A professional, full-stack web application designed to process, analyze, and visualize hierarchical node relationships. Built with an Express.js backend and a React/Vite frontend.

## 🌟 Features
- **Algorithm-driven Processing**: Efficiently computes deep tree relationships, accurately identifies pure cycles, resolves multi-parent conflicts natively, and safely tracks duplicate inputs.
- **Dynamic Frontend Visualization**: Recursively visualizes complex data hierarchies beautifully using React.
- **Strict Validation Layer**: Gracefully intercepts malformed strings, structural errors, and missing nodes before they reach the core logic.
- **Clean Architecture**: Built with a decoupled API structure (`controllers`, `services`, `routes`, `middlewares`) providing immense scalability and maintainability.

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Axios
- **Backend:** Node.js, Express.js, CORS
- **Tooling:** Dotenv for environment configuration

## 📂 Project Structure
```text
bajaj/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API logic and input validation
│   │   ├── middlewares/      # Centralized error handling
│   │   ├── routes/           # Express router definitions
│   │   ├── services/         # Core algorithmic processing (The Brain)
│   │   └── server.js         # Backend entry point
│   ├── .env                  # Environment Variables
│   └── package.json          # Node dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component and Tree visualizer
│   │   ├── main.jsx          # React DOM mounting
│   │   └── index.css         # Custom UI styling
│   ├── vite.config.js        # Vite compiler config
│   └── package.json          # React dependencies
└── README.md
```

## 🚀 Getting Started
Check out the [RUN_GUIDE.md](./RUN_GUIDE.md) for detailed instructions on how to start the development servers locally in seconds.

## 📦 Deployment
This project is pre-configured for 1-click deployments to top-tier cloud providers:
- **Backend**: Render, Railway, or Heroku.
- **Frontend**: Vercel or Netlify.
Check out `deployment.md` for full hosting instructions.
