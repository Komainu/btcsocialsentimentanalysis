// pages/index.js
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]); // keep last X avg scores for chart
  const [loading, setLoading] = useState(false);

  async function fetchSummary() {
    setLoading(true);
    try {
      const res = await fetch("/api/summary?n=50");
      const j = await res.json();
      if (j.ok) {
        setSummary(j);
        setHistory((h) => {
          const newH = [
            ...h,
            { t: new Date(j.timestamp).toLocaleTimeString(), avg: j.stats.avgScore }
          ];
          return newH.slice(-20);
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
    const id = setInterval(fetchSummary, 15000); // 15s poll
    return () => clearInterval(id);
  }, []);

  const chartData = {
    labels: history.map((h) => h.t),
    datasets: [
      {
        label: "Average sentiment score",
        data: history.map((h) => h.avg),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Farcaster Sentiment Dashboard</h1>

      {loading && <p>Loading...</p>}

      {summary ? (
        <div>
          <p>
            Latest average score: <strong>{summary.stats.avgScore}</strong>
          </p>
          <Line data={chartData} />
        </div>
      ) : (
        <p>No data yet.</p>
      )}
    </div>
  );
}
