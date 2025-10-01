import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createLeaveRequest = async (leaveData, token) => {
  const response = await axios.post(`${API_URL}/api/leave`, leaveData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getLeaveRequests = async (token) => {
  const response = await axios.get(`${API_URL}/api/leave`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const approveLeaveRequest = async (id, token) => {
  const response = await axios.post(`${API_URL}/api/leave/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const denyLeaveRequest = async (id, token) => {
  const response = await axios.post(`${API_URL}/api/leave/${id}/deny`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};