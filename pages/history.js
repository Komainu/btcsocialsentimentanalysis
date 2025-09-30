// pages/history.js
import { supabase } from '../lib/supabaseClient'

export async function getServerSideProps() {
  const { data } = await supabase
    .from('sentiments')
    .select('*')
    .order('date', { ascending: false })

  return { props: { history: data } }
}

export default function History({ history }) {
  return (
    <div>
      <h1>センチメント履歴</h1>
      <ul>
        {history.map(h => (
          <li key={h.date}>
            {h.date} - {h.summary} ({h.sentiment_score})
          </li>
        ))}
      </ul>
    </div>
  )
}
