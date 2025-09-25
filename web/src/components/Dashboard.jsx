import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import { jwtDecode } from 'jwt-decode'; // <-- Import the new library

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); // State to hold user info from token

  // This function fetches notes from the backend
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
      setError('Failed to fetch notes.');
    }
  };

  // useEffect runs when the component loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the token to get user info (like role and tenant plan)
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
    fetchNotes();
  }, []); // The empty array means this runs only once on load

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await apiClient.post(
        '/notes',
        { title: newNoteTitle, content: newNoteContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear the form and refresh the notes list
      setNewNoteTitle('');
      setNewNoteContent('');
      fetchNotes();
    } catch (err) {
      console.error('Failed to create note', err);
      setError(err.response?.data?.message || 'Failed to create note.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the notes list after deleting
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note', err);
      setError('Failed to delete note.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const showUpgradeMessage = user?.tenantPlan === 'FREE' && notes.length >= 3;

  return (
    <div className='dashboard'>
      <h2>Welcome to your Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <hr />

      <h3 className='cool'>Create a New Note</h3>
      {/* Show the upgrade message OR the form to create a note */}
      {showUpgradeMessage ? (
        <div style={{ color: 'orange', border: '1px solid orange', padding: '10px' }}>
          You have reached your 3-note limit on the Free plan. Please upgrade to Pro.
        </div>
      ) : (
        <form onSubmit={handleCreateNote}>
          <div>
            <input
              type="text"
              placeholder="Note Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Note Content"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Create Note</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <hr />
      <h3>Your Notes</h3>
      {notes.length === 0 ? (
        <p className='para'>You don't have any notes yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <strong>{note.title}</strong>: {note.content}
              <button onClick={() => handleDeleteNote(note.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
}

export default Dashboard;