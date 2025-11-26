
import React, { useState, useEffect, useCallback } from 'react';
import { getHolidaysForYear, setHolidaysForYear } from '../api/holiday';
import moment from 'moment';
import toast from 'react-hot-toast';
import '../styles/Employee.css'; // Using Employee.css for consistent styling

const HolidayCalendar = () => {
  const [year, setYear] = useState(moment().year());
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHolidays = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getHolidaysForYear(year);
      setHolidays(res.data.holidays.map(h => ({ 
        ...h, 
        startDate: moment(h.startDate).format('YYYY-MM-DD'),
        endDate: h.endDate ? moment(h.endDate).format('YYYY-MM-DD') : moment(h.startDate).format('YYYY-MM-DD'),
        type: h.type || 'national', 
        applicableToAll: true // Always true as per request
      })));
    } catch (error) {
      toast.error('Failed to fetch holidays.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleAddHoliday = () => {
    setHolidays([...holidays, { startDate: '', endDate: '', name: '', type: 'national', applicableToAll: true }]);
  };

  const handleRemoveHoliday = (index) => {
    if (window.confirm('Are you sure you want to remove this holiday?')) {
      const updatedHolidays = holidays.filter((_, i) => i !== index);
      setHolidays(updatedHolidays);
    }
  };

  const handleHolidayChange = (index, field, value) => {
    const updatedHolidays = holidays.map((holiday, i) => 
      i === index ? { ...holiday, [field]: value } : holiday
    );
    setHolidays(updatedHolidays);
  };

  const handleSave = async () => {
    const validHolidays = holidays.filter(h => h.startDate && h.name);
    if (validHolidays.length !== holidays.length) {
      toast.error('Please ensure all holiday entries have at least a start date and a name.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Ensure endDate is same as startDate if not provided
      const holidaysToSave = validHolidays.map(h => ({
        ...h,
        endDate: h.endDate || h.startDate
      }));
      await setHolidaysForYear(year, holidaysToSave);
      toast.success('Holiday calendar saved successfully!');
      fetchHolidays(); // Re-fetch to ensure data consistency
    } catch (error) {
      toast.error('Failed to save holidays.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 className="employee-title">Holiday Calendar</h2>
        <div className="employee-controls">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="year-select">Year:</label>
            <select id="year-select" value={year} onChange={handleYearChange} className="employee-input">
              {Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button onClick={handleAddHoliday} className="employee-button">Add Holiday</button>
        </div>
      </div>

      {isLoading ? (
        <div className="employee-message">Loading...</div>
      ) : (
        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Holiday Name</th>
                <th>Type</th>
                {/* <th>Applicable To All</th> */}
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {holidays.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No holidays set for this year.
                  </td>
                </tr>
              ) : (
                holidays.map((holiday, index) => (
                  <tr key={holiday._id || index}>
                    <td>
                      <input
                        type="date"
                        className="employee-input"
                        value={holiday.startDate}
                        onChange={(e) => handleHolidayChange(index, 'startDate', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="employee-input"
                        value={holiday.endDate}
                        onChange={(e) => handleHolidayChange(index, 'endDate', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="employee-input"
                        placeholder="Holiday Name"
                        value={holiday.name}
                        onChange={(e) => handleHolidayChange(index, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                        <select 
                            className="employee-input"
                            value={holiday.type} 
                            onChange={(e) => handleHolidayChange(index, 'type', e.target.value)}
                        >
                            <option value="national">National</option>
                            <option value="religious">Religious</option>
                        </select>
                    </td>
                    {/*
                    <td>
                        <input
                            type="checkbox"
                            checked={holiday.applicableToAll}
                            onChange={(e) => handleHolidayChange(index, 'applicableToAll', e.target.checked)}
                        />
                    </td>
                    */}
                    {/* <td>
                      <button onClick={() => handleRemoveHoliday(index)} className="employee-button" style={{ backgroundColor: '#dc3545' }}>Remove</button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="employee-footer" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleSave} disabled={isLoading} className="employee-button">
          {isLoading ? 'Saving...' : 'Save Calendar'}
        </button>
      </div>
    </div>
  );
};

export default HolidayCalendar;
