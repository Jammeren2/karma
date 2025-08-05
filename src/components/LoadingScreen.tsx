import React from 'react';
import { GlitchText } from './GlitchText';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <GlitchText 
            text="ЗАГРУЗКА..."
            className="text-2xl font-bold text-cyan-400"
            intensity="high"
          />
        </div>
        
        <div className="text-gray-500 text-sm">
          Подключение к виртуальной реальности...
        </div>
      </div>
    </div>
  );
};