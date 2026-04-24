# Graph Structure Resolver

A full-stack web application built for the **SRM Full Stack Engineering Challenge — Round 1**. It exposes a REST API that accepts an array of node strings, resolves their hierarchical relationships, detects cycles, and returns structured tree data. A React frontend lets you interact with the API visually.

---

## What it does

You send a JSON array of strings like `["A->B", "A->C", "B->D"]`, and the API:

- Parses and validates every entry
- Groups nodes into connected components
- Builds nested tree objects for acyclic groups
- Flags cyclic groups with `has_cycle: true`
- Tracks invalid entries and duplicate edges
- Returns a summary with total trees, total cycles, and the root of the deepest tree

---

## Live Demo

| | URL |
|---|---|
| **API** | [`https://graph-structure-resolver.onrender.com/bfhl`](https://graph-structure-resolver.onrender.com/bfhl) |
| **Frontend** | [`https://graph-structure-resolver.vercel.app`](https://graph-structure-resolver.vercel.app) |

---

## API Reference

**Endpoint:** `POST /bfhl`  
**Content-Type:** `application/json`

### Request

```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello", "1->2"]
}
```

### Response

```json
{
  "user_id": "kadapalavenkatanikithreddy_11012006",
  "email_id": "kv9529@srmist.edu.in",
  "college_roll_number": "RA2311003010214",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": {}, "C": {} } },
      "depth": 2
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": ["hello", "1->2"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

### Validation Rules

| Input | Result |
|---|---|
| `"A->B"` | ✅ Valid edge |
| `"hello"` | ❌ Not a node format |
| `"1->2"` | ❌ Not uppercase letters |
| `"AB->C"` | ❌ Multi-character parent |
| `"A-B"` | ❌ Wrong separator |
| `"A->"` | ❌ Missing child |
| `"A->A"` | ❌ Self-loop |
| `" A->B "` | Trimmed first, then validated |
| `"A->B"` appearing twice | Second + occurrence → `duplicate_edges`, added once |
| `A->D` and `B->D` both present | First edge wins; second silently discarded (diamond case) |

---

## Project Structure

```
graph-structure-resolver/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── bfhlController.js     # request validation, calls service
│   │   ├── middlewares/
│   │   │   └── errorMiddleware.js    # global error handler
│   │   ├── routes/
│   │   │   └── bfhlRoutes.js         # POST /bfhl route
│   │   ├── services/
│   │   │   └── hierarchyService.js   # all the graph logic lives here
│   │   └── app.js                    # express setup, cors, routes
│   ├── server.js                     # entry point, starts the server
│   ├── .env                          # PORT (not committed)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # main component + tree renderer
│   │   ├── main.jsx                  # react dom mount
│   │   └── index.css                 # all styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
├── RUN_GUIDE.md
└── deployment.md
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```

The backend reads `PORT` from `.env`. Default is `5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

By default the frontend points to `http://localhost:5000/bfhl`. To override (e.g. for a deployed backend), create `frontend/.env`:

```
VITE_API_URL=https://your-backend.onrender.com/bfhl
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express |
| Frontend | React 18, Vite |
| HTTP Client | Axios |
| Fonts | Inter, JetBrains Mono (Google Fonts) |
| Deployment | Render (backend) · Vercel (frontend) |

---

## Algorithm Overview

The core logic in `hierarchyService.js` works in three passes:

1. **Parse & validate** — walk every input string, trim whitespace, check the `X->Y` format with a strict regex, reject self-loops, track duplicates with a Set so each duplicate is recorded exactly once

2. **Group into components** — union-find with path compression groups the valid edges into connected components

3. **Classify each component** — if the component has no node without a parent, it's a pure cycle (use lex-smallest node as label); otherwise it's a tree. Build the nested tree object, compute depth recursively, then pick the deepest root (lex-smaller root breaks ties)

Response time for 50 nodes is well under 3 seconds since everything is in-memory with no I/O.

---

## Deployment

See [`deployment.md`](./deployment.md) for step-by-step hosting instructions on Render + Vercel.

Key things before deploying:
- Set `PORT` env var on your backend host (Render does this automatically)
- Set `VITE_API_URL` on your frontend host pointing to your live backend URL
- The API has CORS open (`cors()` with no restrictions) so the evaluator can call it from any origin

---

## Author

**Kadapala Venkata Nikith Reddy**  
`kv9529@srmist.edu.in` · Roll No. `RA2311003010214`
