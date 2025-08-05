import React, { useState } from 'react';
import { Users, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { GroupInfo } from '../hooks/api';
import { GlitchText } from './GlitchText';

interface HeroSectionProps {
  groupInfo: GroupInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ groupInfo }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const telegramLink = groupInfo.links.find(link => link.includes('t.me'));
  const vrchatGroupUrl = `https://vrchat.com/home/group/${groupInfo.id}`;

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Banner */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(15,23,42,0.9)), url(${groupInfo.banner_url})`,
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col justify-center min-h-screen">
        <div className="text-center mb-12">
          {/* Group Icon */}
          <div className="mb-8">
            <img 
              src={groupInfo.icon_url} 
              alt={groupInfo.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-cyan-400 shadow-lg shadow-cyan-400/50 hover:scale-110 transition-transform duration-300"
              style={{
                filter: 'contrast(1.2) brightness(1.1)'
              }}
            />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <GlitchText 
              text="I HATE REALITY" 
              className="text-white"
              intensity="high"
            />
          </h1>
          
          {/* Group Name */}
          <h2 className="text-2xl md:text-3xl font-semibold text-cyan-400 mb-8">
            <GlitchText 
              text={groupInfo.name}
              intensity="medium"
            />
          </h2>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                <GlitchText text={groupInfo.member_count.toString()} intensity="low" />
              </div>
              <div className="text-sm text-gray-400">Участников</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                <GlitchText text={groupInfo.online_member_count.toString()} intensity="low" />
              </div>
              <div className="text-sm text-gray-400">Онлайн</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            {/* Telegram Link */}
            {telegramLink && (
              <a 
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-4 px-8 rounded-lg text-xl transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70"
                style={{
                  animation: 'neon-glow 2s ease-in-out infinite alternate'
                }}
              >
                <MessageCircle className="inline mr-2" size={24} />
                JOIN TELEGRAM
              </a>
            )}


            {/* VRChat Group Link */}
            <a 
              href={vrchatGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-lg text-xl transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70"
              style={{
                animation: 'neon-glow-purple 2s ease-in-out infinite alternate'
              }}
            >
              <ExternalLink className="inline mr-2" size={24} />
              ОТКРЫТЬ В VRCHAT
            </a>
          
          </div>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-6 mb-6 border border-cyan-500/30">
            <p className="text-gray-300 leading-relaxed">
              {showFullDescription 
                ? groupInfo.description
                : groupInfo.description.substring(0, 300) + '...'
              }
            </p>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-cyan-400 hover:text-cyan-300 mt-2 underline"
            >
              {showFullDescription ? 'Свернуть' : 'Читать полностью'}
            </button>
          </div>

          {/* Rules */}
          <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg border border-cyan-500/30 overflow-hidden">
            <button 
              onClick={() => setShowRules(!showRules)}
              className="w-full p-4 text-left bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-cyan-400">
                Правила группы {showRules ? '▼' : '▶'}
              </h3>
            </button>
            {showRules && (
              <div className="p-6">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {groupInfo.rules}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes neon-glow {
          0% { box-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff; }
          100% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
        }
        @keyframes neon-glow-purple {
          0% { box-shadow: 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6; }
          100% { box-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6; }
        }
      `}</style>
    </section>
  );
};