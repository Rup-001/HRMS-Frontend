import React, { useState, useEffect } from 'react';
import { getCompanies } from '../api/company';
import '../styles/ShiftForm.css'; // Import the new CSS file

const ShiftForm = ({ shift, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    gracePeriod: '',
    overtimeThreshold: '',
    companyId: '',
  });

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getCompanies(token);
        if (response.success) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        gracePeriod: shift.gracePeriod || '',
        overtimeThreshold: shift.overtimeThreshold || '',
        companyId: shift.companyId?._id || shift.companyId || '',
      });
    } else {
      setFormData({
        name: '',
        startTime: '',
        endTime: '',
        gracePeriod: '',
        overtimeThreshold: '',
        companyId: '',
      });
    }
  }, [shift]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      gracePeriod: parseInt(formData.gracePeriod, 10) || 0,
      overtimeThreshold: parseInt(formData.overtimeThreshold, 10) || 0,
    };
    onSave(dataToSave);
  };

  return (
    <div className="shift-form-modal">
      <div className="shift-form-container">
        <div className="mt-3 text-center">
          <h3 className="shift-form-title">{shift ? 'Edit Shift' : 'Add Shift'}</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="shift-form-group">
              <label htmlFor="companyId">Company</label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
                disabled={!!shift}
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company._id} value={company._id}>{company.name}</option>
                ))}
              </select>
            </div>
            <div className="shift-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={!!shift}
              />
            </div>
            <div className="shift-form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="shift-form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="shift-form-group">
              <label htmlFor="gracePeriod">Grace Period (minutes)</label>
              <input
                type="number"
                name="gracePeriod"
                value={formData.gracePeriod}
                onChange={handleChange}
              />
            </div>
            <div className="shift-form-group">
              <label htmlFor="overtimeThreshold">Overtime Threshold (minutes)</label>
              <input
                type="number"
                name="overtimeThreshold"
                value={formData.overtimeThreshold}
                onChange={handleChange}
              />
            </div>
            <div className="shift-form-actions">
              <button
                type="submit"
                className="shift-form-submit-button"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="shift-form-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShiftForm;