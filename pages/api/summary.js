// pages/api/summary.js
export default async function handler(req, res) {
  try {
    const items = global.__SENTIMENT_STORE__.items || [];
    const lastN = Number(req.query.n || 50);
    const recent = items.slice(0, lastN);

    // stats
    const total = recent.length;
    let sumScore = 0;
    let pos = 0, neg = 0, neu = 0;

    recent.forEach(it => {
      sumScore += it.score;
      if (it.score > 0) pos++;
      else if (it.score < 0) neg++;
      else neu++;
    });

    const avgScore = total ? sumScore / total : 0;
    const posRatio = total ? pos / total : 0;
    const negRatio = total ? neg / total : 0;
    const neuRatio = total ? neu / total : 0;

    res.status(200).json({
      ok: true,
      stats: { total, avgScore, pos, neg, neu, posRatio, negRatio, neuRatio },
      recent,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
}
