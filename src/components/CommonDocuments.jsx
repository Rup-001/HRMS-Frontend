import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCommonDocuments } from '../api/document';
import '../styles/Employee.css';

const CommonDocuments = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getCommonDocuments(token);
        if (data.success) {
          setDocuments(data.data);
        } else {
          setError(data.error || 'Failed to fetch documents');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) return <div className="employee-message">Loading documents...</div>;
  if (error) return <div className="employee-message employee-error">{error}</div>;

  return (
    <div className="employee-container">
      <h2 className="employee-title">Company Documents</h2>
      {documents.length === 0 ? (
        <div className="employee-message">No documents found.</div>
      ) : (
        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Description</th>
                <th>Uploaded By</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.documentType}</td>
                  <td>{doc.description || '-'}</td>
                  <td>{doc.uploadedBy?.fullName || '-'}</td>
                  <td>
                    <a href={`${import.meta.env.VITE_API_URL}${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommonDocuments;
