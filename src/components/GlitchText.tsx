import React, { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '', 
  intensity = 'medium' 
}) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, intensity === 'high' ? 800 : intensity === 'medium' ? 1500 : 3000);

    return () => clearInterval(glitchInterval);
  }, [intensity]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className={`${glitchActive ? 'animate-pulse opacity-80' : ''} transition-all duration-150`}
        style={{
          textShadow: glitchActive 
            ? '2px 0 #00ffff, -2px 0 #ff0080, 0 0 10px #00ffff' 
            : '0 0 10px rgba(0, 255, 255, 0.3)'
        }}
      >
        {text}
      </span>
      {glitchActive && (
        <>
          <span 
            className="absolute top-0 left-0 opacity-70 text-cyan-400"
            style={{ 
              transform: 'translate(-2px, 0)',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
            }}
          >
            {text}
          </span>
          <span 
            className="absolute top-0 left-0 opacity-70 text-pink-500"
            style={{ 
              transform: 'translate(2px, 0)',
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
};