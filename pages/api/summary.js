// pages/api/summary.js

// グローバルストア初期化
if (!global.__SENTIMENT_STORE__) {
  global.__SENTIMENT_STORE__ = { items: [] };
}

const COINGECKO_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

export default async function handler(req, res) {
  try {
    const items = global.__SENTIMENT_STORE__.items || [];
    const lastN = Number(req.query.n || 50);
    const recent = items.slice(-lastN); // ← 最新 n 件を取得するよう修正

    // stats
    const total = recent.length;
    let sumScore = 0;
    let pos = 0;
    let neg = 0;
    let neu = 0;

    recent.forEach((it) => {
      sumScore += it.score;
      if (it.score > 0) pos++;
      else if (it.score < 0) neg++;
      else neu++;
    });

    const avgScore = total ? sumScore / total : 0;

    // fetch price (CoinGecko)
    let priceUsd = null;
    try {
      const r = await fetch(COINGECKO_PRICE_URL);
      const j = await r.json();
      priceUsd = j?.bitcoin?.usd ?? null;
    } catch (e) {
      console.warn("coingecko error", e);
    }

    return res.status(200).json({
      ok: true,
      stats: {
        total,
        avgScore,
        pos,
        neg,
        neu,
        posRatio: total ? pos / total : 0,
        negRatio: total ? neg / total : 0,
        neuRatio: total ? neu / total : 0,
      },
      recent,
      priceUsd,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}
