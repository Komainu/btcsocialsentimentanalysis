// pages/history.js
import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/summary?n=200");
      const data = await res.json();
      if (data.ok) setHistory(data.recent);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>センチメント履歴</h1>
      <ul>
        {history.map(h => (
          <li key={h.id}>
            {h.createdAt} - {h.text} (score: {h.score})
          </li>
        ))}
      </ul>
    </div>
  );
}
