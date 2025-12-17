import { useState } from 'react';
import axios from 'axios';

const SkillForm = ({ onSuccess, onClose, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Programming',
    level: initialData?.level || 'Beginner'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`/api/skills/${initialData._id}`, formData);
      } else {
        await axios.post('/api/skills', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving skill');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="text" name="title" placeholder="Skill Title (e.g. React.js Tutoring)" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description..." rows="4" value={formData.description} onChange={handleChange} required></textarea>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <select name="category" value={formData.category} onChange={handleChange} style={{ flex: 1 }}>
          <option value="Programming">Programming</option>
          <option value="Design">Design</option>
          <option value="Language">Language</option>
          <option value="Music">Music</option>
          <option value="Other">Other</option>
        </select>
        
        <select name="level" value={formData.level} onChange={handleChange} style={{ flex: 1 }}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Post Skill</button>
    </form>
  );
};

export default SkillForm;
