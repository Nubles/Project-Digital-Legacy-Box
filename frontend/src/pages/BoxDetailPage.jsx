import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function BoxDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const { user } = useContext(AuthContext);

  const fetchBoxDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/boxes/${id}/`);
      setBox(response.data);
    } catch (err) {
      setError('Failed to fetch box details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBoxDetails();
    }
  }, [id, user]);

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newMemoryContent.trim()) return;

    try {
      await api.post(`/boxes/${id}/memories/`, {
        content: newMemoryContent,
      });
      setNewMemoryContent('');
      // Refetch box details to show the new memory
      fetchBoxDetails();
    } catch (err) {
      setError('Failed to add memory.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!box) return <div>Box not found.</div>;

  return (
    <div>
      <h1>{box.name}</h1>
      <p><strong>For:</strong> {box.recipient_email}</p>
      <p><strong>Unlocks on:</strong> {box.release_date}</p>

      <hr />

      <h2>Memories</h2>
      {box.memories.length === 0 ? (
        <p>No memories added yet.</p>
      ) : (
        <ul>
          {box.memories.map((memory) => (
            <li key={memory.id}>{memory.content}</li>
          ))}
        </ul>
      )}

      <hr />

      <h3>Add a New Memory</h3>
      <form onSubmit={handleAddMemory}>
        <textarea
          value={newMemoryContent}
          onChange={(e) => setNewMemoryContent(e.target.value)}
          placeholder="Write your memory here..."
          rows="5"
          style={{ width: '100%', padding: '10px' }}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Add Memory</button>
      </form>
    </div>
  );
}

export default BoxDetailPage;
