# MELEEY AI

MELEEY AI is a responsive Somali/English AI chat app with a dark-and-gold interface.

## Current features
- Responsive chat interface
- Server-side Free AI endpoint at `/api/chat` using Groq
- Optional web search through Tavily at `/api/search`
- Health endpoint at `/api/health`
- Recent conversation history stored in the browser
- Supabase email signup/login UI (requires Supabase configuration)
- Free plan: $0
- Pro plan display: $5/month (checkout is not enabled yet)

## Vercel environment variables

Add these under Project Settings → Environment Variables, then redeploy:

Required for Free AI:
- `GROQ_API_KEY` — private Groq API key

Required for Supabase email authentication:
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase publishable key (safe for browser use)

Optional for web search:
- `TAVILY_API_KEY` — private Tavily API key. The free Researcher plan currently includes 1,000 credits/month with no credit card required. Search requests are made server-side; the key is never sent to the browser.

Optional:
- `GROQ_MODEL` — a model supported by your Groq account. Default: `openai/gpt-oss-120b`.

## Current limitations
- Chat history is local to the browser, not synced to a cloud account.
- Supabase auth UI is present, but authenticated chat storage, session refresh, and account-level plan enforcement are not implemented.
- Pro checkout, subscriptions, and payment verification are not implemented. The $5/month price is planned only.
- File uploads, image understanding, and cloud library are not implemented.

## Security notes
- Never put private API keys in `index.html` or commit them to GitHub.
- Add private keys only in Vercel Environment Variables.
- Never expose the Supabase service-role key in browser code.
- API use is subject to provider limits and availability.
