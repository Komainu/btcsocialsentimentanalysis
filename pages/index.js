// pages/api/ingest.js
import Sentiment from "sentiment";

const sentiment = new Sentiment();

// In-memory store (サーバーが稼働している間だけ保持)
if (!global.__SENTIMENT_STORE__) {
  global.__SENTIMENT_STORE__ = {
    items: [] // { id, text, source, score, comparative, createdAt }
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body || {};
    const text = payload.text || payload.message || "";
    const source = payload.source || "unknown";

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing text field in body" });
    }

    const result = sentiment.analyze(text);
    const entry = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      text,
      source,
      score: result.score,
      comparative: result.comparative,
      createdAt: new Date().toISOString()
    };

    // ストアに追加
    global.__SENTIMENT_STORE__.items.unshift(entry);
    // 最大 200 件まで保持
    global.__SENTIMENT_STORE__.items = global.__SENTIMENT_STORE__.items.slice(0, 200);

    res.status(200).json({ ok: true, entry });
  } catch (err) {
    console.error("ingest error", err);
    return res.status(500).json({ error: "internal error" });
  }
}
