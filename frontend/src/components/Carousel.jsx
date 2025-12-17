import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius)', margin: '1rem 0' }}>
      <div style={{ 
        display: 'flex', 
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentIndex * 100}%)` 
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ minWidth: '100%', padding: '2rem', background: 'var(--bg-card)', boxSizing: 'border-box', textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {item.username[0].toUpperCase()}
            </div>
            <h3>{item.username}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Top Rated Instructor</p>
          </div>
        ))}
      </div>
      
      <button onClick={prev} style={{
        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}><FaChevronLeft /></button>
      
      <button onClick={next} style={{
        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}><FaChevronRight /></button>
    </div>
  );
};

export default Carousel;
