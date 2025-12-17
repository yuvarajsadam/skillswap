import { FaCode, FaMusic, FaLanguage, FaPencilAlt, FaBrain } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const CategoryIcon = ({ category }) => {
  switch (category?.toLowerCase()) {
    case 'programming': return <FaCode color="#3b82f6" />;
    case 'design': return <FaPencilAlt color="#ec4899" />;
    case 'language': return <FaLanguage color="#a855f7" />;
    case 'music': return <FaMusic color="#f59e0b" />;
    default: return <FaBrain color="#64748b" />;
  }
};

const SkillCard = ({ skill, onClick }) => {
  return (
    <div 
      className="card" 
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        height: '100%',
        margin:"20px",
     
      }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(0px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ 
          backgroundColor: 'var(--bg-dark)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '1rem', 
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CategoryIcon category={skill.category} />
          {skill.category}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true })}
        </span>
      </div>

      <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem' }}>{skill.title}</h3>
      
      <p style={{ 
        color: 'var(--text-muted)', 
        fontSize: '0.9rem', 
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {skill.description}
      </p>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}>
            {skill.user?.username?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: '0.9rem' }}>{skill.user?.username}</span>
        </div>
        <span style={{ 
          fontSize: '0.8rem', 
          color: skill.level === 'Beginner' ? 'var(--success)' : skill.level === 'Advanced' ? 'var(--secondary)' : 'var(--primary)' 
        }}>
          {skill.level}
        </span>
      </div>
    </div>
  );
};

export default SkillCard;
