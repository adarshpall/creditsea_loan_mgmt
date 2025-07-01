'use client';
import { useEffect, useState } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/status');
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error('Error fetching status:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="text-gray-500">Loading system status...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
      <h2 className="text-lg font-semibold">📊 System Status</h2>
      <ul className="text-sm space-y-1">
        <li>📥 Incoming Rate: <strong>{status.incomingRate} req/sec</strong></li>
        <li>✅ Processed: <strong>{status.processedRate} req/sec</strong></li>
        <li>❌ Errors: <strong>{status.errorRate} req/sec</strong></li>
        <li>🔁 Retry Queue: <strong>{status.retryQueue}</strong></li>
        <li>🧠 Memory Usage: <strong>{status.memory} MB</strong></li>
        <li>🔌 Socket: <strong>{status.socketConnected ? 'Connected' : 'Disconnected'}</strong></li>
      </ul>
    </div>
  );
}
