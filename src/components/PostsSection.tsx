import React, { useState } from 'react';
import { Calendar, User } from 'lucide-react';
import { GroupPost } from '../hooks/api';
import { GlitchText } from './GlitchText';

interface PostsSectionProps {
  posts: GroupPost[];
}

export const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <GlitchText 
            text="ПОСЛЕДНИЕ НОВОСТИ"
            className="text-cyan-400"
            intensity="medium"
          />
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <article 
              key={post.id}
              className="bg-slate-800 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {post.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    style={{
                      filter: 'contrast(1.1) brightness(0.9) hue-rotate(5deg)'
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {post.text}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(post.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </article>
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
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