import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function DashboardPage() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await api.get('/boxes/');
        setBoxes(response.data);
      } catch (err) {
        setError('Failed to fetch legacy boxes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBoxes();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Your Legacy Boxes</h1>
        <Link to="/create-box" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
          + Create New Box
        </Link>
      </div>
      {boxes.length === 0 ? (
        <p>You haven't created any legacy boxes yet.</p>
      ) : (
        <ul>
          {boxes.map((box) => (
            <li key={box.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', listStyle: 'none' }}>
              <Link to={`/box/${box.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2>{box.name}</h2>
                <p>For: {box.recipient_email}</p>
                <p>Unlocks on: {box.release_date}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;
