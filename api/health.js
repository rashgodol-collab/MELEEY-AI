export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  const aiReady = Boolean(process.env.GROQ_API_KEY);
  return res.status(200).json({
    ok: true,
    app: "MELEEY AI",
    server: "online",
    aiReady,
    freeReady: aiReady,
    proConfigured: Boolean(process.env.OPENAI_API_KEY),
    freeModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    proPrice: 5,
    proCurrency: "USD",
    proEnabled: false,
    message: aiReady
      ? "MELEEY Free AI is configured. Pro checkout is not enabled yet."
      : "Add GROQ_API_KEY in Vercel environment variables to enable Free AI."
  });
}
