import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
export const getDocuments = async (token, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/document${query ? `?${query}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { success: false, error: error.message };
  }
};

export const getDocumentById = async (id, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/document/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    return { success: false, error: error.message };
  }
};

export const uploadDocument = async (formData, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/document`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCommonDocuments = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/documents/common`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, error: 'Network error' };
  }
};