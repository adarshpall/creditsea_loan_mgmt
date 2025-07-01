'use client';
import { useState } from 'react';

export default function ErrorTable({ logs }: any) {
  const [search, setSearch] = useState('');
  const [errorType, setErrorType] = useState('');
  const [timeframe, setTimeframe] = useState('all'); // options: all, 5m, 1h, 24h

  // ✅ Beautify raw error messages
  const formatError = (msg: string) => {
    if (msg.includes('amount')) return 'Loan amount must be a valid number';
    if (msg.includes('timestamp')) return 'Timestamp is missing or invalid';
    if (msg.includes('applicant')) return 'Applicant name is required';
    if (msg.includes('id')) return 'Loan ID is missing or invalid';
    return msg;
  };

  const getTimeLimit = () => {
    const now = new Date();
    switch (timeframe) {
      case '5m': return new Date(now.getTime() - 5 * 60 * 1000);
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      default: return null;
    }
  };

  const filtered = logs.filter((log: any) => {
    const matchesApplicant = log.loan?.applicant?.toLowerCase().includes(search.toLowerCase());
    const matchesError = errorType ? log.error?.toLowerCase().includes(errorType.toLowerCase()) : true;
    const limit = getTimeLimit();
    const matchesTime = limit ? new Date(log.timestamp) >= limit : true;
    return matchesApplicant && matchesError && matchesTime;
  });

  const uniqueErrorTypes = Array.from(
    new Set(logs.map((log: any) => log.error))
  ) as string[];

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">❗ Error Logs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by applicant"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => setErrorType(e.target.value)}
          value={errorType}
        >
          <option value="">All Error Types</option>
          {uniqueErrorTypes.map((e, i) => (
            <option key={i} value={e}>{formatError(e)}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => setTimeframe(e.target.value)}
          value={timeframe}
        >
          <option value="all">All Time</option>
          <option value="5m">Last 5 Minutes</option>
          <option value="1h">Last 1 Hour</option>
          <option value="24h">Last 24 Hours</option>
        </select>
      </div>

      <div className="overflow-auto max-h-80">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Applicant</th>
              <th className="p-2 text-left">Error</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No logs found</td>
              </tr>
            ) : (
              filtered.map((log: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{log.loan.applicant}</td>
                  <td className="p-2 text-red-500">{formatError(log.error)}</td>
                  <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
