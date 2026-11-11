export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ configured: false, error: "Method not allowed" });
  }

  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  const validUrl = /^https:\/\/[^/]+\.supabase\.co\/?$/.test(url);

  if (!validUrl || !anonKey) {
    return res.status(200).json({ configured: false });
  }

  // The Supabase anon/publishable key is intended for browser use.
  // Never expose the Supabase service-role key here.
  return res.status(200).json({
    configured: true,
    url: url.replace(/\/$/, ""),
    anonKey
  });
}
