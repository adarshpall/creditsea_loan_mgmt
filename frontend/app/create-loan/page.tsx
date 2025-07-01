'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateLoan() {
  const [formData, setFormData] = useState({
    id: '',
    applicant: '',
    amount: '',
    timestamp: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/loans/loanpost', {
        ...formData,
        amount: parseFloat(formData.amount),
        timestamp: new Date(formData.timestamp),
      });

      if (res.status === 201) {
        alert('✅ Loan created successfully!');
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);

      const message = err.response?.data?.error;

      // 🎯 Friendly error messages
      if (message?.includes('duplicate')) {
        setError('❌ This Loan ID is already taken!');
      } else if (message?.toLowerCase().includes('paused')) {
        setError('⏸️ Processing is paused. Please resume to submit loans.');
      } else if (message) {
        setError(`⚠️ ${message}`);
      } else {
        setError('⚠️ Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">➕ Create New Loan</h1>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="id"
          placeholder="Loan ID"
          value={formData.id}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="applicant"
          placeholder="Applicant Name"
          value={formData.applicant}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="timestamp"
          type="datetime-local"
          value={formData.timestamp}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
