# 🌿 AIVA Web Application (`health-tracker-web`)

This folder contains the Next.js web application for **AIVA (AI + Vitality)**.

For full architectural details, design philosophy, and database schema, please refer to the [Root README](../README.md).

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🔑 Environment Configuration

Ensure you have a `.env.local` file configured with:

```env
NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
GROQ_API_KEY="<your-groq-api-key>"
```

---

## 🧭 Routes

* `/` — Main dashboard featuring the **Cinematic Video Hero**, vitality score gauge, metrics overview, daily log history, and quick entry form.
* `/drift` — Alternate experience featuring the interactive **3D Drift Wall** gallery with parallax perspective tilt and dynamic vitality tiles.
* `/api/agent/chat` — Groq AI endpoint handling conversational coaching (`AIVA`), insights generation, and natural language log parsing.
* `/api/entries` — REST endpoint for querying and upserting daily health logs to Supabase.
