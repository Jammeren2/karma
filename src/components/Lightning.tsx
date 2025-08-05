import React, { useEffect, useState } from 'react';

export const Lightning: React.FC = () => {
  const [flashes, setFlashes] = useState<{ id: number; side: 'left' | 'right' }[]>([]);

  useEffect(() => {
    const flashInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        const newFlash = {
          id: Date.now(),
          side: Math.random() < 0.5 ? 'left' : 'right'
        };
        
        setFlashes(prev => [...prev, newFlash]);
        
        setTimeout(() => {
          setFlashes(prev => prev.filter(flash => flash.id !== newFlash.id));
        }, 200);
      }
    }, 2000);

    return () => clearInterval(flashInterval);
  }, []);

  return (
    <>
      {flashes.map(flash => (
        <div
          key={flash.id}
          className={`fixed top-0 ${flash.side === 'left' ? 'left-0' : 'right-0'} w-1 h-full pointer-events-none z-40`}
        >
          <div 
            className="w-full h-full opacity-60 animate-pulse"
            style={{
              background: 'linear-gradient(to bottom, transparent, #00ffff, #ffffff, #00ffff, transparent)',
              boxShadow: `${flash.side === 'left' ? '2px' : '-2px'} 0 20px #00ffff`,
              animation: 'lightning-flash 0.2s ease-out'
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes lightning-flash {
          0% { opacity: 0; width: 1px; }
          50% { opacity: 1; width: 3px; }
          100% { opacity: 0; width: 1px; }
        }
      `}</style>
    </>
  );
};