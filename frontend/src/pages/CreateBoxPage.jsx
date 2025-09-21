import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function CreateBoxPage() {
  const [name, setName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/boxes/', {
        name,
        recipient_email: recipientEmail,
        release_date: releaseDate,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create box. Please check your input.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Create a New Legacy Box</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Box Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Recipient's Email:</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Release Date:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Box</button>
      </form>
    </div>
  );
}

export default CreateBoxPage;
