// pages/api/ingest.js
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0,10)

  // DBにあるか確認
  const { data, error } = await supabase
    .from('sentiments')
    .select('*')
    .eq('date', today)

  if (data && data.length > 0) {
    return res.status(200).json(data[0])
  }

  // 外部API呼び出し（ダミー）
  const sentiment = { 
    date: today, 
    sentiment_score: 0.72, 
    summary: "全体的にポジティブ",
    sources: ["twitter", "reddit"]
  }

  // DBに保存
  await supabase.from('sentiments').insert(sentiment)

  res.status(200).json(sentiment)
}
