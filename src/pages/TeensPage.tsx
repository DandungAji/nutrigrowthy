
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Home, Play, Star, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TeensPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);

  const filters = [
    { id: 'fruit-crown', name: 'Fruit Crown', emoji: '👑', description: 'Wear a magical crown of fresh fruits!' },
    { id: 'milk-mustache', name: 'Milk Mustache', emoji: '🥛', description: 'Classic milk mustache for strong bones!' },
    { id: 'veggie-power', name: 'Veggie Power', emoji: '💪', description: 'Get super powers from vegetables!' },
    { id: 'rainbow-aura', name: 'Rainbow Nutrition', emoji: '🌈', description: 'Show your colorful healthy eating!' },
  ];

  const educationalContent = [
    {
      title: "Super Foods Comic Series",
      type: "comic",
      thumbnail: "🦸‍♀️",
      description: "Join Captain Carrot and the Nutrition Squad!"
    },
    {
      title: "How Your Body Uses Food",
      type: "video",
      thumbnail: "🎬",
      description: "Fun animated explanation of digestion"
    },
    {
      title: "Build Your Power Plate",
      type: "game",
      thumbnail: "🎮",
      description: "Interactive game to learn food groups"
    }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch (err) {
      console.log('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    // Simulate photo capture with filter
    alert(`📸 Amazing photo captured with ${activeFilter?.name}! In a real app, this would save your filtered photo.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Home size={20} />
            Back Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🧒 Teens & Kids Zone
          </h1>
          <div className="text-2xl">🎉</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-6 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            Welcome to Your Nutrition Adventure! 🌟
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Take awesome photos with AR filters, play games, and discover how food makes you super strong! 💪
          </p>
        </div>
      </section>

      {/* AR Photo Filters Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold mb-4 text-purple-800">
              📱 AR Photo Magic
            </h3>
            <p className="text-lg text-gray-600">
              Pick a filter and take the coolest nutrition-themed photos ever!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Camera/Preview Area */}
            <div className="relative">
              <Card className="overflow-hidden shadow-2xl border-4 border-purple-300 animate-scale-in">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center relative overflow-hidden">
                    {isCapturing ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <Camera size={80} className="mx-auto mb-4 text-purple-600" />
                        <p className="text-lg font-semibold text-purple-800 mb-4">
                          Ready for some photo fun?
                        </p>
                        <Button
                          onClick={startCamera}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-bold rounded-full transform hover:scale-105 transition-all duration-300"
                        >
                          <Camera className="mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    )}
                    
                    {/* Filter Overlay Simulation */}
                    {activeFilter && isCapturing && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="text-6xl animate-pulse">{activeFilter.emoji}</div>
                      </div>
                    )}
                  </div>
                  
                  {isCapturing && (
                    <div className="p-4 bg-white flex justify-center gap-4">
                      <Button
                        onClick={capturePhoto}
                        disabled={!activeFilter}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold"
                      >
                        📸 Capture Magic!
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Filter Selection */}
            <div className="space-y-6 animate-fade-in delay-300">
              <h4 className="text-2xl font-bold text-purple-800 text-center">
                Choose Your Filter Magic! ✨
              </h4>
              <div className="grid gap-4">
                {filters.map((filter) => (
                  <Card
                    key={filter.id}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      activeFilter?.id === filter.id
                        ? 'ring-4 ring-purple-400 bg-purple-50'
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="text-4xl">{filter.emoji}</div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg text-gray-800">{filter.name}</h5>
                        <p className="text-gray-600">{filter.description}</p>
                      </div>
                      {activeFilter?.id === filter.id && (
                        <Star className="text-purple-500 fill-current" size={24} />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold mb-4 text-orange-800">
              🎓 Learn & Play
            </h3>
            <p className="text-lg text-gray-600">
              Discover amazing facts about nutrition through comics, videos, and games!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {educationalContent.map((content, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">{content.thumbnail}</div>
                  <h4 className="text-xl font-bold mb-3 text-gray-800">{content.title}</h4>
                  <p className="text-gray-600 mb-6">{content.description}</p>
                  <Button
                    className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-full px-6 py-2 font-bold transform hover:scale-105 transition-all duration-300"
                  >
                    <Play className="mr-2" size={16} />
                    {content.type === 'comic' ? 'Read Now' : content.type === 'video' ? 'Watch Now' : 'Play Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
        <div className="max-w-4xl mx-auto text-center px-6 animate-fade-in">
          <h3 className="text-4xl font-bold text-white mb-6">
            🏆 Your Nutrition Achievements
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-4xl mb-3">🌟</div>
              <h4 className="font-bold text-lg">Photo Master</h4>
              <p className="text-sm opacity-90">Take 5 AR photos</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-4xl mb-3">📚</div>
              <h4 className="font-bold text-lg">Nutrition Expert</h4>
              <p className="text-sm opacity-90">Complete 3 comics</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-4xl mb-3">💪</div>
              <h4 className="font-bold text-lg">Healthy Hero</h4>
              <p className="text-sm opacity-90">Share 10 photos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeensPage;
