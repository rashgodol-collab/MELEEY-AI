const MAX_TEXT_CHARS = 5000;
let cachedVoices = null;
let cachedAt = 0;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    return res.status(503).json({ error: "Multilingual neural speech is not configured yet." });
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const language = typeof body.language === "string" ? body.language.toLowerCase() : "en";
  if (!text) return res.status(400).json({ error: "Text is required." });
  if (text.length > MAX_TEXT_CHARS) return res.status(413).json({ error: "Text is too long for one speech request." });

  const locales = {
    so:"so-SO", en:"en-US", ar:"ar-SA", fr:"fr-FR", es:"es-ES", pt:"pt-BR",
    de:"de-DE", it:"it-IT", nl:"nl-NL", tr:"tr-TR", id:"id-ID", sw:"sw-KE",
    zh:"zh-CN", ja:"ja-JP", ko:"ko-KR", ru:"ru-RU", el:"el-GR", he:"he-IL",
    th:"th-TH", hi:"hi-IN", bn:"bn-IN", ta:"ta-IN", te:"te-IN", kn:"kn-IN",
    ml:"ml-IN", my:"my-MM", km:"km-KH", pa:"pa-IN", gu:"gu-IN", or:"or-IN",
    si:"si-LK", ka:"ka-GE", hy:"hy-AM", am:"am-ET", dv:"dv-MV", pl:"pl-PL",
    sv:"sv-SE", da:"da-DK", no:"nb-NO", fi:"fi-FI", uk:"uk-UA", vi:"vi-VN",
    ro:"ro-RO", hu:"hu-HU", cs:"cs-CZ", sk:"sk-SK", sl:"sl-SI", hr:"hr-HR",
    sr:"sr-RS", bg:"bg-BG", sq:"sq-AL", af:"af-ZA", ps:"ps-AF", ur:"ur-PK",
    ne:"ne-NP", az:"az-AZ", kk:"kk-KZ", uz:"uz-UZ", ms:"ms-MY", fil:"fil-PH"
  };
  const locale = locales[language] || language;
  try {
    if (!cachedVoices || Date.now() - cachedAt > 6 * 60 * 60 * 1000) {
      const listResponse = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`, {
        headers: { "Ocp-Apim-Subscription-Key": key }
      });
      if (!listResponse.ok) return res.status(502).json({ error: "Could not load supported speech voices from Azure." });
      cachedVoices = await listResponse.json();
      cachedAt = Date.now();
    }
    const matching = cachedVoices.filter(v => (v.Locale || "").toLowerCase() === locale.toLowerCase() && v.Status === "GA");
    const voice = matching.find(v => v.Gender === "Female") || matching[0];
    if (!voice) return res.status(422).json({ error: `No Azure neural voice is currently available for ${locale}.` });
    const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const ssml = `<speak version="1.0" xml:lang="${voice.Locale}"><voice name="${voice.ShortName}">${safeText}</voice></speak>`;
    const speech = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "MELEEY-AI"
      },
      body: ssml
    });
    if (!speech.ok) return res.status(502).json({ error: "Azure could not synthesize speech for this text." });
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline; filename=meleey-speech.mp3");
    const audio = Buffer.from(await speech.arrayBuffer());
    return res.status(200).send(audio);
  } catch (error) {
    return res.status(502).json({ error: "Multilingual speech service could not be reached." });
  }
}
