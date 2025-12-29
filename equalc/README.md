# X-Ray: Debugging for Non-Deterministic Pipelines

X-Ray is a system designed to provide deep visibility into multi-step, non-deterministic workflows (like LLM chains, search/RAG pipelines, and complex decision trees). Unlike traditional tracing which focuses on _latency_ and _errors_, X-Ray focuses on **reasoning** and **decision context**.

## Deliverables
- **X-Ray Library (Go)**: A lightweight SDK to instrument your code.
- **Dashboard (Next.js)**:  UI to visualize trace timelines, candidate filtering, and internal reasoning.
- **Demo App**: A simulated "Competitor Product Selection" pipeline demonstrating the 3-step logical flow.

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+ & npm

### Project Structure
The project uses a Go Workspace (`go.work`) containing:
- `xray/`: The core library and models.
- `xray-dashboard/`: The backend API and frontend dashboard.
- `demo/`: The sample application.

### Running the System

1. **Start the Dashboard Backend & Frontend**
   Run the dashboard server (which serves the API):
   ```bash
   cd xray-dashboard
   go run main.go start
   ```
   In a separate terminal, start the frontend:
   ```bash
   cd xray-dashboard/frontend
   npm run dev
   ```
   Access the dashboard at `http://localhost:3000`.

2. **Run the Demo Application**
   The demo app simulates a "Competitor Selection" workflow to generate trace data.
   ```bash
   cd demo
   go run main.go
   ```
   Refesh the dashboard to see the new trace.

## Approach & Architecture

### X-Ray Library
The library is built around the concept of **Traces** and **Steps**.
- **Steps** capture `Inputs`, `Outputs`, and `Reasoning`.
- **Evaluations** are a specialized substructure for filtering/selection steps. They capture `Candidates`, `Reference Context`, and detailed `Checks` (pass/fail logic).
- **Data Model**: Uses SQLite (via GORM) for a zero-dependency, portable persistence layer.

### Dashboard
- **Vertical Timeline**: Visualizes the flow of data.
- **High-Density Views**: Candidates and checks are rendered in a compact grid to allow quick scanning of "why" a candidate failed.
- **Reasoning First**: The UI prioritizes showing the human-readable reasoning string for each step.

## Known Limitations / Future Improvements
- **Storage**: Currently uses local SQLite. For a production system, this would be abstracted to support PostgreSQL/DynamoDB (Interface `IStorage` exists).
- **Real-time**: The dashboard currently requires a refresh to see new traces. WebSockets could be added for live streaming.
