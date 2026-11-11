export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const aiReady = Boolean(process.env.OPENAI_API_KEY);
  return res.status(200).json({
    ok: true,
    app: "MELEEY AI",
    server: "online",
    aiReady,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    message: aiReady ? "AI configuration is present." : "Add OPENAI_API_KEY in Vercel environment variables."
  });
}
