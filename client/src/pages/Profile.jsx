import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard'; // Reuse
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); 
  // If id is not present but it shouldn't happen based on route, or default to current user
  const effectiveId = id || user?.id;
  
  const [profileSkills, setProfileSkills] = useState([]);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    if (effectiveId) {
      const fetchProfile = async () => {
        try {
            const res = await axios.get(`/api/users/${effectiveId}/skills`);
            setProfileSkills(res.data);

            // Calculate stats for charts
            // Example: Count by category
            const counts = res.data.reduce((acc, skill) => {
                acc[skill.category] = (acc[skill.category] || 0) + 1;
                return acc;
            }, {});
            
            const data = Object.keys(counts).map(key => ({
                name: key,
                count: counts[key]
            }));
            setStatsData(data);
        } catch (err) {
            console.error(err);
        }
      };
      fetchProfile();
    }
  }, [effectiveId]);

  const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#a855f7'];

  return (
    <>
      <Navbar onAddSkill={() => {}} />
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Profile Stats</h1>
        
        <div style={{ marginBottom: '3rem', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData}>
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2>User Skills</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {profileSkills.map(skill => (
            <SkillCard key={skill._id} skill={{...skill, user: {username: 'User'}}} onClick={() => {}} />
          ))} 
           {/* Note: User object might be populated differently or just ID. The user route returns skills which contain user ID. 
               We might want to fetch user details to display name properly if we are viewing another user's profile.
               But for now "User" placeholder or just hide user info on own profile.
           */}
        </div>
      </div>
    </>
  );
};

export default Profile;
