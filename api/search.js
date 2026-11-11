const MAX_QUERY_CHARS = 400;
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "Web Search is not configured yet. Add TAVILY_API_KEY in Vercel, then redeploy."
    });
  }
  const query = typeof req.query?.q === "string" ? req.query.q.trim().slice(0, MAX_QUERY_CHARS) : "";
  if (!query) return res.status(400).json({ error: "Enter a search query." });
  try {
    const upstream = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        topic: "general",
        max_results: 5,
        include_answer: false,
        include_raw_content: false
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const reason = data?.detail || data?.message || data?.error;
      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: typeof reason === "string" ? reason.slice(0, 300) : "The web search provider could not complete the request."
      });
    }
    const results = (Array.isArray(data.results) ? data.results : []).slice(0, 5).map(item => ({
      title: String(item.title || "Search result").slice(0, 300),
      link: typeof item.url === "string" && /^https?:\/\//i.test(item.url) ? item.url : "",
      snippet: String(item.content || "").slice(0, 1200)
    })).filter(item => item.link);
    return res.status(200).json({ results });
  } catch {
    return res.status(502).json({ error: "Could not connect to the web search service. Please try again." });
  }
}
