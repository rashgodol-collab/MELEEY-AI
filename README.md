# MELEEY AI

MELEEY AI is a dark-and-gold AI assistant web app.

## Features
- Responsive chat interface
- Server-side AI endpoint at `/api/chat`
- Conversation context for recent messages
- API key kept on the server, never in browser code

## Deploy the full AI app with Vercel
1. Sign in to Vercel using GitHub.
2. Import `rashgodol-collab/MELEEY-AI`.
3. In Project Settings → Environment Variables, add:
   - Name: `OPENAI_API_KEY`
   - Value: your private API key from the AI provider
4. Optionally add `OPENAI_MODEL` with a model available to your API account. Default: `gpt-4o-mini`.
5. Deploy the project.

Never put the API key in `index.html`, commit it to GitHub, or share it in chat. API usage may incur provider charges.

## Important
The frontend and backend code are in this repository, but live AI replies require deployment and a valid API key. Live web search is not yet implemented; the assistant is instructed not to claim it has browsed the internet.
