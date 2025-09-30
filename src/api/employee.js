import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createEmployee = async (employeeData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/employees`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, error: 'Network error' };
  }
};

export const updateEmployee = async (id, employeeData, token) => {
  try {
    const response = await axios.patch(`${API_URL}/api/employees/${id}`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, error: 'Network error' };
  }
};

export const getEmployees = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, error: 'Network error' };
  }
};

export const getEmployeeById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, error: 'Network error' };
  }
};