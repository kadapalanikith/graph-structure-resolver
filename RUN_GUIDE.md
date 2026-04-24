# 🚀 How to Run the Project Locally

Follow these simple steps to get both the backend and frontend running on your local machine simultaneously.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

---

### Step 1: Start the Backend Server

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(You should see a message saying: `Server running on port 5000`)*

---

### Step 2: Start the Frontend Application

1. Open a **new, separate terminal window** (keep the backend terminal running).
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install the frontend dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(You should see a local URL provided, typically `http://localhost:5173`)*

---

### Step 3: Test the Application

1. Open your web browser and go to the link provided by Vite (e.g., `http://localhost:5173`).
2. Enter a JSON array of node strings in the text area. For example:
   ```json
   [
     "A->B",
     "A->C",
     "B->D",
     "X->Y",
     "Y->X",
     "A->A"
   ]
   ```
3. Click the **Process Hierarchies** button.
4. You will instantly see the processed trees, cycle detections, invalid entry logs, and summary analytics beautifully rendered!
