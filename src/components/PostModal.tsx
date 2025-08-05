import React from 'react';
import { X } from 'lucide-react';
import { GroupPost } from '../hooks/api';
import { GlitchText } from './GlitchText';

interface PostModalProps {
  post: GroupPost;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-cyan-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-cyan-500 p-4 flex justify-between items-center">
          <GlitchText 
            text={post.title} 
            className="text-xl font-bold text-cyan-400" 
            intensity="low"
          />
          <button 
            onClick={onClose}
            className="text-cyan-400 hover:text-white transition-colors p-2"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full rounded-lg mb-4 hover:scale-105 transition-transform duration-300"
              style={{
                filter: 'contrast(1.1) brightness(0.9) hue-rotate(10deg)'
              }}
            />
          )}
          
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
          
          <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-gray-500">
            Опубликовано: {new Date(post.created_at).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};