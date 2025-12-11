import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard';
import Carousel from '../components/Carousel';
import Modal from '../components/Modal';
import SkillForm from '../components/SkillForm';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const isModalOpenState = useState(false); // Fix: useState returns array, destructuring below
  const [isModalOpen, setIsModalOpen] = isModalOpenState;
  const navigate = useNavigate();
  
  // Dummy data for carousel (could fetch top users)
  const featuredUsers = [
    { username: 'Alex' }, { username: 'Sarah' }, { username: 'Mike' }
  ];

  const fetchSkills = async () => {
    try {
      const res = await axios.get('https://skillswap-ffy2.onrender.com/api/skills');
      setSkills(res.data);
      setFilteredSkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    let result = skills;
    if (search) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(search.toLowerCase()) || 
        s.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      result = result.filter(s => s.category === category);
    }
    setFilteredSkills(result);
  }, [search, category, skills]);

  return (
    <>
      <Navbar onAddSkill={() => setIsModalOpen(true)} />
      
      <div className="container">
        <Carousel items={featuredUsers} />

        <div style={{ margin: '2rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search skills..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ flex: 2, minWidth: '200px' }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1, minWidth: '150px' }}>
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Language">Language</option>
            <option value="Music">Music</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredSkills.map(skill => (
            <SkillCard key={skill._id} skill={skill} onClick={() => navigate(`/skills/${skill._id}`)} />
          ))}
          {filteredSkills.length === 0 && (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem', color: 'var(--text-muted)' }}>
              No skills found. Be the first to share one!
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Share a New Skill">
        <SkillForm onSuccess={fetchSkills} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Dashboard;
