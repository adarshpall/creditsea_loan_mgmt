'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AllLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await axios.get('http://localhost:8000/api/loans/allLoans');
        setLoans(res.data);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLoans();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">📋 All Loans</h1>

      {loading ? (
        <p>Loading...</p>
      ) : loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Applicant</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Processed At</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan: any) => (
              <tr key={loan.id} className="text-center">
                <td className="p-2 border">{loan.id}</td>
                <td className="p-2 border">{loan.applicant}</td>
                <td className="p-2 border">{loan.amount}</td>
                <td className="p-2 border">{loan.status}</td>
                <td className="p-2 border">{new Date(loan.timestamp).toLocaleString()}</td>
                <td className="p-2 border">{loan.processedAt ? new Date(loan.processedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
