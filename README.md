✅ Local Setup Instructions
# Go to frontend directory
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

Requirements:

Node.js ≥ 18

Internet connection (for Hugging Face or OpenAI requests, if enabled)

🧭 Architecture
graph TD
  A[User Interface - Next.js + Tailwind] --> B[Campaign Creation Form]
  B --> C[Rule Builder UI]
  B --> D[AI Message Suggestion]
  C --> E[API Call: /api/rules]
  D --> F[Hugging Face API Call]

🤖 AI Tools & Tech Used (Frontend)
Next.js – React framework with SSR and API support.

Tailwind CSS – Utility-first styling.

Hugging Face Inference API (Flask model) – Generates promotional messages based on user-defined campaign goals.

ShadCN UI (optional) – For UI components.

⚠️ Known Limitations (Frontend)
Only works in modern browsers.

Message suggestions rely on external inference API (may add latency).

No offline mode.
