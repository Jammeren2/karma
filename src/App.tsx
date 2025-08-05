import React from 'react';
import { useApi } from './hooks/useApi';
import { SEOHead } from './components/SEOHead';
import { HeroSection } from './components/HeroSection';
import { PostsSection } from './components/PostsSection';
import { InstancesSection } from './components/InstancesSection';
import { ParallaxGallery } from './components/ParallaxGallery';
import { CRTNoise } from './components/CRTNoise';
import { Lightning } from './components/Lightning';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';

function App() {
  const { data, loading, error } = useApi();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!data) return <ErrorScreen error="Нет данных" />;

  return (
    <div className="bg-black text-white relative">
      {/* Dynamic SEO */}
      <SEOHead groupInfo={data?.group_info} />
      
      {/* Background Effects */}
      <CRTNoise />
      <Lightning />
      
      {/* Main Content */}
      <HeroSection groupInfo={data.group_info} />
      <InstancesSection instances={data.group_instances} />
      <PostsSection posts={data.group_posts} />
      <ParallaxGallery galleryImages={data.galleryImages} />
      
      {/* Footer */}
      <footer className="bg-slate-900 py-8 text-center border-t border-cyan-500/30">
        <div className="container mx-auto px-4">
          <p className="text-gray-400 text-sm">
            Последнее обновление: {new Date(data.last_updated).toLocaleString('ru-RU')}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            VRChat Group • Karma • I HATE REALITY
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;