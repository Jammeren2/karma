import React from 'react';

export const CRTNoise: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div 
          className="w-full h-full bg-repeat animate-pulse"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0),
              linear-gradient(0deg, transparent 24%, rgba(0,255,255,0.03) 25%, rgba(0,255,255,0.03) 26%, transparent 27%, transparent 74%, rgba(0,255,255,0.03) 75%, rgba(0,255,255,0.03) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '4px 4px, 100% 3px',
            animation: 'crt-flicker 0.15s infinite linear alternate'
          }}
        />
      </div>
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.1; }
          100% { opacity: 0.05; }
        }
      `}</style>
    </>
  );
};