import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaUserCircle, FaSignOutAlt, FaPlus } from 'react-icons/fa';

const Navbar = ({ onAddSkill }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary)' }}>
        <FaGraduationCap size={28} />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SkillSwap</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button className="btn btn-primary" onClick={onAddSkill}>
          <FaPlus /> Share Skill
        </button>
        
        <Link to={`/profile/${user?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', textDecoration: 'none' }}>
            <FaUserCircle size={24} />
            <span style={{ fontWeight: 500 }}>{user?.username}</span>
        </Link>

        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Logout">
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
