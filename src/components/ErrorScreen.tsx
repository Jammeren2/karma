import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { GlitchText } from './GlitchText';

interface ErrorScreenProps {
  error: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
        
        <GlitchText 
          text="СИСТЕМА НЕДОСТУПНА"
          className="text-2xl font-bold text-red-500 mb-4"
          intensity="high"
        />
        
        <p className="text-gray-400 mb-6">
          Не удалось подключиться к серверу группы
        </p>
        
        <div className="bg-slate-900 border border-red-500/30 rounded-lg p-4 text-sm text-gray-300">
          <strong>Ошибка:</strong> {error}
        </div>
      </div>
    </div>
  );
};