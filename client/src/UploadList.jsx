import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

function UploadList() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [lists, setLists] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch distributed lists on mount
  useEffect(() => {
    axios.get('https://mern-stack-website-2ku3.onrender.com/api/list/distributed', {
      headers: { Authorization: token }
    })
      .then(res => setLists(res.data.lists || []))
      .catch(() => setLists([]));
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && ['csv', 'xlsx', 'xls'].includes(selected.name.split('.').pop().toLowerCase())) {
      setFile(selected);
      setError('');
    } else {
      setError('Only CSV, XLSX, and XLS files are allowed.');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('https://mern-stack-website-2ku3.onrender.com/api/list/upload', formData, { headers: { Authorization: token } });
      setLists(res.data.lists);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload List CSV/XLSX/XLS</h2>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
      <button className="btn btn-primary mt-2" onClick={handleUpload}>Upload</button>
      {error && <div className="text-danger mt-2">{error}</div>}
      <div className="mt-4">
        <h4>Distributed Lists</h4>
        {lists.length > 0 && lists.map((agentList, idx) => (
          <div key={agentList.agentId || idx} className="mb-4">
            <h5>
              {agentList.agentName} ({agentList.agentEmail})
            </h5>
            <ul>
              {agentList.items.map((item, i) => (
                <li key={i}>
                  {item.FirstName} - {item.Phone} - {item.Notes}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadList;
