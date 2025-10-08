import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createCompany = async (data, token) => {
  const response = await axios.post(`${API_URL}/api/company`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCompanies = async (token) => {
  const response = await axios.get(`${API_URL}/api/company`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};