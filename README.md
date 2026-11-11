# MELEEY AI

MELEEY AI is a responsive Somali/English AI chat app with a dark-and-gold interface.

## Current Step 1 features
- Responsive chat interface
- Server-side Free AI endpoint at `/api/chat` using Groq
- Health endpoint at `/api/health`
- Recent conversation context (kept in the browser session)
- Server-side API key handling
- Free plan: $0
- Pro plan display: $5/month (checkout is not enabled yet)

## Deploy on Vercel
1. Import `rashgodol-collab/MELEEY-AI` into Vercel.
2. In Project Settings → Environment Variables, add:
   - Name: `GROQ_API_KEY`
   - Value: your private Groq API key
3. Optional:
   - `GROQ_MODEL` — a model supported by your Groq account. Default: `openai/gpt-oss-120b`.
4. Deploy or redeploy after changing environment variables.

## Important security notes
- Never put an API key in `index.html`, commit it to GitHub, or share it in chat.
- Add secrets only in Vercel Environment Variables.
- API use is subject to the provider's free-tier limits and availability.

## Not implemented yet
- Live web search and sourced citations
- File uploads and image understanding
- User accounts and persistent cloud chat history
- Pro checkout, subscriptions, and payment verification

The Pro price shown in the interface is a planned price only. Do not charge users until secure authentication, payment processing, and server-side plan verification are implemented.
