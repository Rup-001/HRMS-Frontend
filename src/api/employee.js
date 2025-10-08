import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getEmployeeProfile = async (employeeId, token) => {
  const response = await axios.get(`${API_URL}/api/employees/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getEmployees = async (token) => {
  const response = await axios.get(`${API_URL}/api/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createEmployee = async (formData, token) => {
  const response = await axios.post(`${API_URL}/api/employees`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEmployee = async (employeeId, formData, token) => {
  const response = await axios.patch(`${API_URL}/api/employees/${employeeId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};