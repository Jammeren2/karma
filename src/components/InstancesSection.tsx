import React from 'react';
import { Users, Globe, Gamepad2 } from 'lucide-react';
import { GroupInstance } from '../hooks/api';
import { GlitchText } from './GlitchText';

interface InstancesSectionProps {
  instances: GroupInstance[];
}

export const InstancesSection: React.FC<InstancesSectionProps> = ({ instances }) => {
  if (!instances || instances.length === 0) {
    return null;
  }

  const handleInstanceClick = (instance: GroupInstance) => {
    // Создаем VRChat ссылку для присоединения к инстансу
    const vrchatUrl = `vrchat://launch?ref=vrchat.com&id=${instance.location}`;
    window.open(vrchatUrl, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <GlitchText 
            text="НАШИ ИНСТАНСЫ"
            className="text-cyan-400"
            intensity="medium"
          />
        </h2>
        
        <div className={`${instances.length === 1 ? 'flex justify-center' : instances.length === 2 ? 'flex justify-center flex-wrap' : 'grid md:grid-cols-2 lg:grid-cols-3 justify-items-center'} gap-6`}>
          {instances.map((instance, index) => (
            <div 
              key={instance.instance_id}
              className="bg-slate-800 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer w-full max-w-sm"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
              onClick={() => handleInstanceClick(instance)}
            >
              {/* World Image */}
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={instance.world.image_url || instance.world.thumbnail_image_url} 
                  alt={instance.world.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  style={{
                    filter: 'contrast(1.1) brightness(0.9) hue-rotate(5deg)'
                  }}
                />
                
                {/* Instance Status Overlay */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 rounded-lg px-3 py-1 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-semibold">АКТИВЕН</span>
                </div>
                
                {/* User Count Badge */}
                <div className="absolute bottom-4 left-4 bg-cyan-500 bg-opacity-90 rounded-lg px-3 py-1 flex items-center space-x-1">
                  <Users size={16} className="text-black" />
                  <span className="text-black font-bold text-sm">
                    {instance.detailed_info.n_users}/{instance.detailed_info.capacity}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {/* World Name */}
                <h3 className="text-xl font-semibold text-cyan-400 mb-2 line-clamp-1">
                  {instance.world.name}
                </h3>
                
                {/* World Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {instance.world.description}
                </p>
                
                {/* Instance Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Globe size={12} />
                      <span>Регион: {instance.detailed_info.region.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  {/* Platform Distribution */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>PC: {instance.detailed_info.platforms.standalonewindows}</span>
                    <span>Android: {instance.detailed_info.platforms.android}</span>
                    <span>iOS: {instance.detailed_info.platforms.ios}</span>
                  </div>
                  
                  {/* Queue Info */}
                  {instance.detailed_info.queue_enabled && instance.detailed_info.queue_size > 0 && (
                    <div className="text-xs text-yellow-400 bg-yellow-400/10 rounded px-2 py-1">
                      В очереди: {instance.detailed_info.queue_size}
                    </div>
                  )}
                </div>
                
                {/* Join Button */}
                <button 
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInstanceClick(instance);
                  }}
                >
                  ПРИСОЕДИНИТЬСЯ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};