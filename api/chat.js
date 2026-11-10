export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "AI service is not configured yet. Add OPENAI_API_KEY in your hosting provider's environment variables." });
  }
  try {
    const { message, history = [] } = req.body || {};
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Please enter a message." });
    }
    const safeHistory = Array.isArray(history) ? history.slice(-10).filter(m =>
      m && ["user", "assistant"].includes(m.role) && typeof m.content === "string"
    ) : [];
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are MELEEY AI, a helpful, accurate assistant. Reply in the language the user uses. Be clear and practical. Do not claim to browse the internet unless a browsing tool is connected." },
          ...safeHistory,
          { role: "user", content: message.trim() }
        ],
        temperature: 0.7
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || "AI provider request failed." });
    }
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No response was returned." });
  } catch (error) {
    return res.status(500).json({ error: "Server error while contacting the AI service." });
  }
}