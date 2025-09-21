import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function BoxDetailPage() {
  const { id } = useParams();
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memory form state
  const [memoryType, setMemoryType] = useState('LETTER');
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [newMemoryFile, setNewMemoryFile] = useState(null);

  // Keyholder form state
  const [keyholderEmail, setKeyholderEmail] = useState('');

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
    const formData = new FormData();
    formData.append('memory_type', memoryType);
    if (memoryType === 'LETTER') {
      formData.append('content', newMemoryContent);
    } else {
      formData.append('file', newMemoryFile);
    }
    try {
      await api.post(`/boxes/${id}/memories/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewMemoryContent('');
      setNewMemoryFile(null);
      fetchBoxDetails();
    } catch (err) {
      setError('Failed to add memory.');
    }
  };

  const handleAddKeyholder = async (e) => {
    e.preventDefault();
    if (!keyholderEmail.trim()) return;
    try {
      await api.post(`/boxes/${id}/keyholders/`, { email: keyholderEmail });
      setKeyholderEmail('');
      fetchBoxDetails();
    } catch (err) {
      setError('Failed to add keyholder.');
    }
  };

  const renderMemory = (memory) => {
    switch (memory.memory_type) {
      case 'LETTER': return <p>{memory.content}</p>;
      case 'PHOTO': return <img src={memory.file} alt="Memory" style={{ maxWidth: '400px' }} />;
      case 'VIDEO': return <video src={memory.file} controls style={{ maxWidth: '400px' }} />;
      default: return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!box) return <div>Box not found.</div>;

  return (
    <div>
      <h1>{box.name}</h1>
      <p><strong>For:</strong> {box.recipient_email}</p>
      <p><strong>Unlocks on:</strong> {box.release_date || 'Keyholder release only'}</p>

      <hr />

      <h2>Keyholders</h2>
      {box.keyholders.length === 0 ? <p>No keyholders assigned.</p> : <ul>{box.keyholders.map(kh => <li key={kh.id}>{kh.email}</li>)}</ul>}
      <form onSubmit={handleAddKeyholder}>
        <h3>Add a Keyholder</h3>
        <input type="email" value={keyholderEmail} onChange={(e) => setKeyholderEmail(e.target.value)} placeholder="Keyholder's email" required />
        <button type="submit">Add Keyholder</button>
      </form>

      <hr />

      <h2>Memories</h2>
      {box.memories.length === 0 ? <p>No memories added yet.</p> : <ul style={{ listStyle: 'none', padding: 0 }}>{box.memories.map(memory => <li key={memory.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem' }}>{renderMemory(memory)}<small style={{ color: '#888' }}>Added on: {new Date(memory.created_at).toLocaleDateString()}</small></li>)}</ul>}

      <hr />

      <h3>Add a New Memory</h3>
      <form onSubmit={handleAddMemory}>
        <div>
          <label><input type="radio" value="LETTER" checked={memoryType === 'LETTER'} onChange={() => setMemoryType('LETTER')} /> Letter</label>
          <label><input type="radio" value="PHOTO" checked={memoryType === 'PHOTO'} onChange={() => setMemoryType('PHOTO')} /> Photo</label>
          <label><input type="radio" value="VIDEO" checked={memoryType === 'VIDEO'} onChange={() => setMemoryType('VIDEO')} /> Video</label>
        </div>
        {memoryType === 'LETTER' ? <textarea value={newMemoryContent} onChange={(e) => setNewMemoryContent(e.target.value)} placeholder="Write your memory here..." rows="5" style={{ width: '100%', padding: '10px', marginTop: '10px' }}/> : <input type="file" onChange={(e) => setNewMemoryFile(e.target.files[0])} style={{ marginTop: '10px' }} accept={memoryType === 'PHOTO' ? 'image/*' : 'video/*'} />}
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Add Memory</button>
      </form>
    </div>
  );
}

export default BoxDetailPage;
