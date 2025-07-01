'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Chart({ received, processed, errors }: any) {
  const data = {
    labels: ['Received', 'Processed', 'Errors'],
    datasets: [
      {
        label: 'Loan Status',
        data: [received, processed, errors],
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">📈 Processing Status</h2>
      <Bar data={data} options={options} />
      <div className="flex justify-between text-sm mt-2">
        <span className="text-red-500">⬤ Errors</span>
        <span className="text-green-500">⬤ Processed</span>
        <span className="text-blue-500">⬤ Received</span>
      </div>
    </div>
  );
}
