import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/shifttemplates';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getShiftTemplates = async () => {
  const response = await axios.get(API_URL/api/shifttemplates, { headers: getAuthHeaders() });
  return response.data;
};

export const createShiftTemplate = async (templateData) => {
  const response = await axios.post(API_URL/api/shifttemplates, templateData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateShiftTemplate = async (id, templateData) => {
  const response = await axios.put(`${API_URL/api/shifttemplates}/${id}`, templateData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteShiftTemplate = async (id) => {
  const response = await axios.delete(`${API_URL/api/shifttemplates}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
