'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { connect } from '../utils/socket';
import Chart from '../components/Chart';
import SystemStatus from '../components/System';
import ErrorTable from '../components/ErrorTable';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    received: 0,
    processed: 0,
    errors: 0,
    logs: [],
  });

  useEffect(() => {
    connect((data) => {
      if (data.type === 'metrics') {
        setMetrics(data.payload);
      }
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">📊 Loan Dashboard</h1>
        <div className="space-x-2">
          {/* ✅ Link Updated to /create-loan */}
          <Link
            href="/create-loan"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Create Loan
          </Link>
          <Link
            href="/all-loans"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            📄 View All Loans
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Chart
          received={metrics.received}
          processed={metrics.processed}
          errors={metrics.errors}
        />
        <SystemStatus />
      </div>

      <ErrorTable logs={metrics.logs} />
    </div>
  );
}
