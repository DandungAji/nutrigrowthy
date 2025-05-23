
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Baby, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-orange-400/20 to-blue-400/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-bounce text-6xl">🥕</div>
          <div className="absolute top-40 right-20 animate-bounce delay-300 text-5xl">🍎</div>
          <div className="absolute bottom-32 left-20 animate-bounce delay-500 text-4xl">🥛</div>
          <div className="absolute bottom-20 right-10 animate-bounce delay-700 text-5xl">🥦</div>
          <div className="absolute top-1/2 left-1/4 animate-pulse text-3xl">🌟</div>
          <div className="absolute top-1/3 right-1/3 animate-pulse delay-1000 text-3xl">💚</div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
          <div className="mb-8 animate-scale-in">
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-green-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
              NutriGrowthy
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="text-yellow-500 animate-pulse" size={32} />
              <p className="text-2xl text-gray-700 font-medium">Growing Healthy, Growing Happy!</p>
              <Sparkles className="text-yellow-500 animate-pulse" size={32} />
            </div>
          </div>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed animate-fade-in delay-300">
            Welcome to the ultimate nutrition adventure! Discover the magic of healthy eating through 
            interactive games, AR photo filters, and educational content designed for the whole family.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Button
              onClick={() => navigate('/teens')}
              className="group h-24 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 animate-fade-in delay-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🧒</div>
                <div className="text-left">
                  <div className="font-bold">Teens & Kids</div>
                  <div className="text-sm opacity-90">Fun filters & games!</div>
                </div>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Button>

            <Button
              onClick={() => navigate('/parents')}
              className="group h-24 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 animate-fade-in delay-700"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">👨‍👩‍👧‍👦</div>
                <div className="text-left">
                  <div className="font-bold">Parents</div>
                  <div className="text-sm opacity-90">Educational resources</div>
                </div>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Why Choose NutriGrowthy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make nutrition education exciting and accessible for everyone in the family
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 hover:scale-105 transition-transform duration-300 animate-fade-in delay-300">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-green-800">AR Photo Filters</h3>
              <p className="text-gray-700">
                Take fun photos with fruit crowns, milk mustaches, and veggie power effects!
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 hover:scale-105 transition-transform duration-300 animate-fade-in delay-500">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-800">Interactive Learning</h3>
              <p className="text-gray-700">
                Engaging comics and educational videos that make learning nutrition fun!
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 hover:scale-105 transition-transform duration-300 animate-fade-in delay-700">
              <div className="text-6xl mb-4">👪</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">Family Friendly</h3>
              <p className="text-gray-700">
                Separate sections for kids and parents with age-appropriate content and resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-orange-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center px-6 animate-fade-in">
          <div className="text-6xl mb-6">🌈</div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Nutrition Adventure Today!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of families making healthy choices fun and interactive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/teens')}
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300"
            >
              Start Playing Now! 🎉
            </Button>
            <Button
              onClick={() => navigate('/parents')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all duration-300"
            >
              Learn More 📚
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
