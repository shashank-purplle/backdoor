# Fulcrum Admin Panel — Backdoor

A lightweight internal admin UI for triggering and monitoring Fulcrum data pipelines. Built with React + Vite.

---

## Features

- **Flow Triggers** — Upload input files to trigger multi-step data pipeline flows (demand updates, assortment additions, dark store allocation, etc.)
- **Base Table Updates** — Direct file-based upserts into `dp_mdq`, `dp_class`, and `dp_fulcrum`
- **Pipeline Step Monitoring** — Each flow card shows intermediate steps; triggering animates them live, step-by-step
- **RBAC Layout** — Flows are grouped by owning user (Shibayan, Akash, Pranay, Pramit) with channel and affected-table metadata
- **Run History** — Every completed run (success or fail) is logged in-session with duration, steps, and error counts

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

> Python + `openpyxl` are only needed if you want to re-parse `Input Format and Validations.xlsx` to update flow definitions. The UI itself is pure JS.

---

## Quickstart

```bash
# 1. Clone the repo
git clone <repo-url>
cd backdoor

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** (or whichever port Vite picks if 5173 is busy) in your browser.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
backdoor/
├── frontend.jsx              # Main UI — all components and RBAC flow definitions
├── src/
│   ├── main.jsx              # React entry point (mounts App from ../frontend.jsx)
│   ├── index.css             # Global styles
│   └── App.jsx               # (unused — entry is frontend.jsx)
├── index.html                # HTML shell
├── vite.config.js            # Vite config
├── Input Format and Validations.xlsx   # Source of truth for flow/RBAC definitions
└── package.json
```

---

## Updating Flow Definitions

All flow cards and pipeline steps live in the `FLOW_GROUPS` and `BASE_TABLES` arrays near the bottom of `frontend.jsx`. These were derived from the **Features - RBAC** sheet in `Input Format and Validations.xlsx`.

To re-read the Excel file with Python:

```bash
pip install openpyxl
python -c "
import openpyxl
wb = openpyxl.load_workbook('Input Format and Validations.xlsx')
ws = wb['Features - RBAC']
for row in ws.iter_rows(values_only=True):
    if any(c is not None for c in row):
        print(row)
"
```

---

## Notes

- Run history is **session-only** (resets on page refresh) — no backend persistence yet.
- The trigger buttons simulate pipeline execution locally; wire up real API calls in the `trigger` / `upload` functions inside `FlowCard` and `BaseTableCard`.
