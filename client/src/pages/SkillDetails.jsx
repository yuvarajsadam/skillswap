import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import SkillForm from '../components/SkillForm';
import { FaUserCircle, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const SkillDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchSkill = async () => {
    try {
      const res = await axios.get(`https://skillswap-ffy2.onrender.com/api/skills/${id}`);
      setSkill(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://skillswap-ffy2.onrender.com/api/skills/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkill();
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`/api/skills/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://skillswap-ffy2.onrender.com/api/skills/${id}/comment`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  if (!skill) return <div>Loading...</div>;

  return (
    <>
      <Navbar onAddSkill={() => setIsEditModalOpen(true)} /> {/* Note: Navbar add skill button might not make sense here to edit, but reusability */}
      
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '1rem' }}>&larr; Back to Dashboard</button>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1>{skill.title}</h1>
            {user && user.id === skill.user._id && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setIsEditModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Edit</button>
                <button onClick={handleDelete} className="btn" style={{ background: 'var(--error)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Delete</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0', color: 'var(--text-muted)' }}>
            <FaUserCircle size={20} />
            <span>{skill.user.username}</span>
            <span>•</span>
            <span>{skill.category}</span>
            <span>•</span>
            <span style={{ color: skill.level === 'Beginner' ? 'var(--success)' : 'var(--primary)' }}>{skill.level}</span>
          </div>

          <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{skill.description}</p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Comments</h3>
          
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)} 
              style={{ flex: 1 }}
              required 
            />
            <button type="submit" className="btn btn-primary">Post</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map(comment => (
              <div key={comment._id} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{comment.user.username}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0 }}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Skill">
        <SkillForm 
            initialData={skill} 
            isEdit={true} 
            onSuccess={() => { fetchSkill(); setIsEditModalOpen(false); }} 
            onClose={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </>
  );
};

export default SkillDetails;
