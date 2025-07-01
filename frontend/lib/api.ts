import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/loans'; // adjust if needed

export const fetchLoans = async () => {
  const res = await axios.get(`${API_BASE}/allLoans`);
  return res.data;
};

export const createLoan = async (loan: any) => {
  const res = await axios.post(`${API_BASE}/loanpost`, loan);
  return res.data;
};
