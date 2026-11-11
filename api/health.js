const MAX_QUERY_CHARS = 400;
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  if (!apiKey || !engineId) {
    return res.status(503).json({
      error: "Google Search is not configured yet. Add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID in Vercel, then redeploy."
    });
  }
  const query = typeof req.query?.q === "string" ? req.query.q.trim().slice(0, MAX_QUERY_CHARS) : "";
  if (!query) return res.status(400).json({ error: "Enter a search query." });
  try {
    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("cx", engineId);
    url.searchParams.set("q", query);
    url.searchParams.set("num", "5");
    const upstream = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const reason = data?.error?.message;
      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: typeof reason === "string" ? reason.slice(0, 300) : "Google Search could not complete the request."
      });
    }
    const results = (Array.isArray(data.items) ? data.items : []).slice(0, 5).map(item => ({
      title: String(item.title || "Search result").slice(0, 300),
      link: typeof item.link === "string" && item.link.startsWith("https://") ? item.link : "",
      snippet: String(item.snippet || "").slice(0, 1200)
    })).filter(item => item.link);
    return res.status(200).json({ results });
  } catch {
    return res.status(502).json({ error: "Could not connect to Google Search. Please try again." });
  }
}
