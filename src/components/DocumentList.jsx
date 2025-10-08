// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { getEmployees } from '../api/employee';
// import { getCompanies } from '../api/company';
// import { getDocuments, getDocumentById, uploadDocument } from '../api/document';
// import '../styles/Employee.css';
// import { Eye, Download } from 'lucide-react';

// const DocumentList = () => {
//   const { user } = useContext(AuthContext);
//   const [documents, setDocuments] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [formData, setFormData] = useState({
//     documentType: '',
//     description: '',
//     document: null,
//   });
//   const authorized = user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const [docResponse, empResponse, compResponse] = await Promise.all([
//           getDocuments(token),
//           getEmployees(token),
//           getCompanies(token),
//         ]);

//         if (docResponse.success && empResponse.success && compResponse.success) {
//           setDocuments(docResponse.data);
//           setEmployees(empResponse.data);
//           setCompanies(compResponse.data);
//         } else {
//           setError(docResponse.error || empResponse.error || compResponse.error || 'Failed to fetch data');
//         }
//       } catch (err) {
//         setError(err.message || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getEmployeeName = (employeeId) => {
//     const employee = employees.find(emp => emp._id === employeeId);
//     // return employee ? `${employee.fullName} (${employee.newEmployeeCode})` : '-';
//     return employee ? employee.fullName  : '-';
//   };
// //   const getEmployeeName = (employeeId) => {
// //   // employeeId might be an object or a string, normalize it
// //   const idToCheck = typeof employeeId === 'string' ? employeeId : employeeId._id;

// //   const employee = employees.find(emp => emp._id === idToCheck);
// //   return employee ? employee.fullName : '-';
// // };

//   const getCompanyName = (companyId) => {
//     const company = companies.find(c => c._id === companyId);
//     return company ? company.name : '-';
//   };

//   const handleView = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await getDocumentById(id, token);

//       if (response.success) {
//         setSelectedDocument(response.data);
//         setShowModal(true);
//       } else {
//         setError(response.error || 'Failed to fetch document details');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch document details');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('employeeId', user.employeeId);
//       formDataToSend.append('companyId', user.companyId);
//       formDataToSend.append('documentType', formData.documentType);
//       formDataToSend.append('description', formData.description);
//       if (formData.document) {
//         formDataToSend.append('document', formData.document);
//       }

//       const response = await uploadDocument(formDataToSend, token);

//       if (response.success) {
//         setSuccess('Document uploaded successfully!');
//         setDocuments([...documents, ...response.data]);
//         setFormData({
//           documentType: '',
//           description: '',
//           document: null,
//         });
//       } else {
//         setError(response.error || 'Failed to upload document');
//       }
//     } catch (err) {
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="employee-message">Loading documents...</div>;
//   if (error) return <div className="employee-message employee-error">{error}</div>;

//   return (
//     <div className="employee-container">
//       <div className="employee-header">
//         <h2 className="employee-title">Documents</h2>
//       </div>
//       {authorized && (
//         <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">
//           <div className="form-grid">
//             <div className="form-group">
//               <label htmlFor="documentType">Document Type *</label>
//               <select
//                 id="documentType"
//                 name="documentType"
//                 value={formData.documentType}
//                 onChange={handleChange}
//                 className="employee-input"
//                 required
//               >
//                 <option value="">Select Document Type</option>
//                 <option value="contract">Contract</option>
//                 <option value="offer_letter">Offer Letter</option>
//                 <option value="id_proof">ID Proof</option>
//                 <option value="certificate">Certificate</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label htmlFor="description">Description</label>
//               <input
//                 type="text"
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="employee-input"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="document">Document File *</label>
//               <input
//                 type="file"
//                 id="document"
//                 name="document"
//                 accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                 onChange={handleChange}
//                 className="employee-input"
//                 required
//               />
//             </div>
//           </div>
//           {success && <p className="employee-message employee-success">{success}</p>}
//           <button type="submit" className="employee-button" disabled={loading}>
//             {loading ? 'Uploading...' : 'Upload Document'}
//           </button>
//         </form>
//       )}
//       {documents.length === 0 ? (
//         <div className="employee-message">No documents found.</div>
//       ) : (
//         <div className="employee-table-container">
//           <table className="employee-table">
//             <thead>
//               <tr>
//                 <th>Employee</th>
//                 <th>Company</th>
//                 <th>Document Type</th>
//                 <th>File Name</th>
//                 <th>Uploaded By</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.map((doc) => (
//                 <tr key={doc._id}>
//                   <td>{getEmployeeName(doc.employeeId)}</td>
//                   <td>{getCompanyName(doc.companyId)}</td>
//                   <td>{doc.documentType || '-'}</td>
//                   <td>{doc.fileName || '-'}</td>
//                   <td>{doc.uploadedBy?.fullName || '-'}</td>
//                   <td>
//                     <button
//                       onClick={() => handleView(doc._id)}
//                       className="employee-button view-button"
//                     >
//                       <Eye className="button-icon" /> View
//                     </button>
//                     <a
//                       href={`${import.meta.env.VITE_API_URL}${doc.fileUrl}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="employee-button download-button"
//                     >
//                       <Download className="button-icon" /> Download
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {showModal && selectedDocument && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal-content employee-modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3 className="modal-title">Document Details</h3>
//             <div className="modal-details">
//               <div className="modal-detail-item">
//                 <strong>Employee:</strong> <span>{getEmployeeName(selectedDocument.employeeId)}</span>
//               </div>
//               <div className="modal-detail-item">
//                 <strong>Company:</strong> <span>{getCompanyName(selectedDocument.companyId)}</span>
//               </div>
//               <div className="modal-detail-item">
//                 <strong>Document Type:</strong> <span>{selectedDocument.documentType || '-'}</span>
//               </div>
//               <div className="modal-detail-item">
//                 <strong>File Name:</strong> <span>{selectedDocument.fileName || '-'}</span>
//               </div>
//               <div className="modal-detail-item">
//                 <strong>Description:</strong> <span>{selectedDocument.description || '-'}</span>
//               </div>
//               <div className="modal-detail-item">
//                 <strong>Uploaded By:</strong> <span>{selectedDocument.uploadedBy?.email || '-'}</span>
//               </div>
//               <div className="modal-detail-item">
//                 <strong>File Size:</strong> <span>{(selectedDocument.size / 1024).toFixed(2)} KB</span>
//               </div>
//               <div className="modal-documents">
//                 <a
//                   href={`${import.meta.env.VITE_API_URL}${selectedDocument.fileUrl}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="modal-document-link"
//                 >
//                   Download Document
//                 </a>
//               </div>
//             </div>
//             <div className="modal-actions">
//               <button onClick={() => setShowModal(false)} className="employee-button modal-button">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentList;




import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployees } from '../api/employee';
import { getCompanies } from '../api/company';
import { getDocuments, getDocumentById, uploadDocument } from '../api/document';
import '../styles/Employee.css';
import { Eye, Download } from 'lucide-react';

const DocumentList = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const authorized =
    user?.role === 'Super Admin' ||
    user?.role === 'HR Manager' ||
    user?.role === 'Company Admin' ||
    user?.role === 'C-Level Executive';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [docResponse, empResponse, compResponse] = await Promise.all([
          getDocuments(token),
          getEmployees(token),
          getCompanies(token),
        ]);

        if (docResponse.success && empResponse.success && compResponse.success) {
          setDocuments(docResponse.data);
          setEmployees(empResponse.data);
          setCompanies(compResponse.data);
        } else {
          setError(docResponse.error || empResponse.error || compResponse.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions to get names
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return '-';

    // If employeeId is an object with fullName, return it directly
    if (typeof employeeId === 'object' && employeeId.fullName) {
      return employeeId.fullName;
    }

    // Otherwise, try to find in employees array
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? employee.fullName : '-';
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c._id === companyId);
    return company ? company.name : '-';
  };

  const getUploaderName = (uploadedBy) => {
    if (!uploadedBy) return '-';

    if (typeof uploadedBy === 'object' && uploadedBy.fullName) {
      return uploadedBy.fullName;
    }

    return uploadedBy.email || '-';
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await getDocumentById(id, token);

      if (response.success) {
        setSelectedDocument(response.data);
        setShowModal(true);
      } else {
        setError(response.error || 'Failed to fetch document details');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch document details');
    }
  };

  const [formData, setFormData] = useState({
    documentType: '',
    description: '',
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('employeeId', user.employeeId);
      formDataToSend.append('companyId', user.companyId);
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('description', formData.description);
      if (formData.document) {
        formDataToSend.append('document', formData.document);
      }

      const response = await uploadDocument(formDataToSend, token);

      if (response.success) {
        setSuccess('Document uploaded successfully!');
        setDocuments([...documents, ...response.data]);
        setFormData({
          documentType: '',
          description: '',
          document: null,
        });
      } else {
        setError(response.error || 'Failed to upload document');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="employee-message">Loading documents...</div>;
  if (error) return <div className="employee-message employee-error">{error}</div>;

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 className="employee-title">Documents</h2>
      </div>
      {authorized && (
        <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="documentType">Document Type *</label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="employee-input"
                required
              >
                <option value="">Select Document Type</option>
                <option value="contract">Contract</option>
                <option value="offer_letter">Offer Letter</option>
                <option value="id_proof">ID Proof</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="employee-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="document">Document File *</label>
              <input
                type="file"
                id="document"
                name="document"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleChange}
                className="employee-input"
                required
              />
            </div>
          </div>
          {success && <p className="employee-message employee-success">{success}</p>}
          <button type="submit" className="employee-button" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      )}
      {documents.length === 0 ? (
        <div className="employee-message">No documents found.</div>
      ) : (
        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Uploaded By</th>
                <th>Company</th>
                <th>Document Type</th>
                {/* <th>File Name</th> */}
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td>{getEmployeeName(doc.employeeId)}</td>
                  <td>{getCompanyName(doc.companyId)}</td>
                  <td>{doc.documentType || '-'}</td>
                  {/* <td>{doc.fileName || '-'}</td> */}
                  <td>{doc.description || '-'}</td>
                  {/* <td>{doc.Description}</td> */}
                  <td>
                    <button onClick={() => handleView(doc._id)} className="employee-button view-button">
                      <Eye className="button-icon" /> View
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL}${doc.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="employee-button download-button"
                    >
                      <Download className="button-icon" /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content employee-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Document Details</h3>
            <div className="modal-details">
              <div className="modal-detail-item">
                <strong>Employee:</strong> <span>{getEmployeeName(selectedDocument.employeeId)}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Company:</strong> <span>{getCompanyName(selectedDocument.companyId)}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Document Type:</strong> <span>{selectedDocument.documentType || '-'}</span>
              </div>
              <div className="modal-detail-item">
                <strong>File Name:</strong> <span>{selectedDocument.fileName || '-'}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Description:</strong> <span>{selectedDocument.description || '-'}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Uploaded By:</strong> <span>{getUploaderName(selectedDocument.uploadedBy)}</span>
              </div>
              <div className="modal-detail-item">
                <strong>File Size:</strong> <span>{(selectedDocument.size / 1024).toFixed(2)} KB</span>
              </div>
              <div className="modal-documents">
                <a
                  href={`${import.meta.env.VITE_API_URL}${selectedDocument.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-document-link"
                >
                  Download Document
                </a>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="employee-button modal-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
