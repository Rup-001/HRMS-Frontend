import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getEmployeeAttendance = async (startDate, endDate, employeeId, token) => {
  try {
    const params = { startDate, endDate };
    if (employeeId) params.employeeId = employeeId;
    const response = await axios.get(`${API_URL}/api/attendance/employee-attendance`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, error: 'Network error' };
  }
};