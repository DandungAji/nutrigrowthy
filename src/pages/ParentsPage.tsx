
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Video, Users, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParentsPage = () => {
  const navigate = useNavigate();

  const resources = [
    {
      title: "Building Healthy Eating Habits",
      type: "guide",
      duration: "10 min read",
      description: "Evidence-based strategies for encouraging nutritious choices in children and teens.",
      icon: "📖"
    },
    {
      title: "Nutrition for Growing Bodies",
      type: "video",
      duration: "15 min watch",
      description: "Expert pediatrician explains macro and micronutrient needs by age group.",
      icon: "🎥"
    },
    {
      title: "Family Meal Planning Made Easy",
      type: "toolkit",
      duration: "Download",
      description: "Weekly meal planners, shopping lists, and kid-friendly recipe cards.",
      icon: "📋"
    }
  ];

  const ageGroups = [
    {
      age: "2-5 years",
      title: "Toddlers & Preschoolers",
      tips: [
        "Offer variety without pressure - it can take 10+ exposures to a new food",
        "Make mealtimes fun with colorful plates and child-sized utensils",
        "Include them in simple food preparation activities",
        "Model healthy eating behaviors yourself"
      ],
      nutrients: ["Calcium for bone development", "Iron for brain growth", "Healthy fats for development"]
    },
    {
      age: "6-12 years",
      title: "School Age",
      tips: [
        "Teach them to read nutrition labels together",
        "Pack nutritious school lunches they helped plan",
        "Establish regular meal and snack times",
        "Encourage trying foods from different cultures"
      ],
      nutrients: ["Protein for growth spurts", "Complex carbs for energy", "Vitamins for immune support"]
    },
    {
      age: "13-18 years",
      title: "Teenagers",
      tips: [
        "Respect their growing independence while guiding choices",
        "Discuss how nutrition affects mood, energy, and performance",
        "Stock healthy snacks for busy schedules",
        "Address body image concerns with compassion"
      ],
      nutrients: ["Calcium for peak bone mass", "Iron (especially for girls)", "B-vitamins for brain function"]
    }
  ];

  const videos = [
    {
      title: "Childhood Obesity Prevention",
      channel: "Pediatric Nutrition Institute",
      description: "Comprehensive guide to maintaining healthy weight in children"
    },
    {
      title: "Picky Eaters: What Really Works",
      channel: "Family Nutrition Expert",
      description: "Evidence-based strategies for expanding your child's palate"
    },
    {
      title: "Sports Nutrition for Young Athletes",
      channel: "Youth Sports Medicine",
      description: "Fueling active kids and teens for optimal performance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            👨‍👩‍👧‍👦 Parent Resources
          </h1>
          <div className="text-2xl">📚</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-6 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            Empowering Parents, Nourishing Families 💙
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Evidence-based resources, expert guidance, and practical tools to support your family's nutrition journey
          </p>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="resources" className="text-lg font-semibold">📚 Resources</TabsTrigger>
              <TabsTrigger value="age-guide" className="text-lg font-semibold">👶 Age Guide</TabsTrigger>
              <TabsTrigger value="videos" className="text-lg font-semibold">🎬 Videos</TabsTrigger>
              <TabsTrigger value="community" className="text-lg font-semibold">👥 Community</TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="space-y-8">
              <div className="text-center mb-8 animate-fade-in">
                <h3 className="text-3xl font-bold mb-4 text-blue-800">Educational Resources</h3>
                <p className="text-lg text-gray-600">Expert-curated content to support your parenting journey</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in bg-white/80 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <CardHeader className="text-center">
                      <div className="text-5xl mb-4">{resource.icon}</div>
                      <CardTitle className="text-xl text-gray-800">{resource.title}</CardTitle>
                      <p className="text-sm text-blue-600 font-semibold">{resource.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{resource.description}</p>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold">
                        {resource.type === 'toolkit' ? <Download className="mr-2" size={16} /> : <BookOpen className="mr-2" size={16} />}
                        {resource.type === 'video' ? 'Watch Now' : resource.type === 'toolkit' ? 'Download' : 'Read More'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="age-guide" className="space-y-8">
              <div className="text-center mb-8 animate-fade-in">
                <h3 className="text-3xl font-bold mb-4 text-purple-800">Age-Specific Nutrition Guide</h3>
                <p className="text-lg text-gray-600">Tailored advice for every stage of development</p>
              </div>

              <div className="space-y-8">
                {ageGroups.map((group, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden shadow-lg animate-fade-in bg-white/80 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 300}ms` }}
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{group.age}</span>
                        {group.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                            💡 Practical Tips
                          </h4>
                          <ul className="space-y-3">
                            {group.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-3">
                                <span className="text-green-500 font-bold">✓</span>
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                            🍎 Key Nutrients
                          </h4>
                          <ul className="space-y-3">
                            {group.nutrients.map((nutrient, nutrientIndex) => (
                              <li key={nutrientIndex} className="flex items-start gap-3">
                                <span className="text-orange-500 font-bold">●</span>
                                <span className="text-gray-700">{nutrient}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-8">
              <div className="text-center mb-8 animate-fade-in">
                <h3 className="text-3xl font-bold mb-4 text-red-800">Educational Videos</h3>
                <p className="text-lg text-gray-600">Expert insights and practical guidance from leading professionals</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in bg-white/80 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-red-200 to-pink-200 rounded-lg mb-4 flex items-center justify-center">
                        <Video size={48} className="text-red-600" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{video.title}</h4>
                      <p className="text-sm text-blue-600 mb-3 font-semibold">{video.channel}</p>
                      <p className="text-gray-600 mb-4">{video.description}</p>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">
                        <ExternalLink className="mr-2" size={16} />
                        Watch on YouTube
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-8">
              <div className="text-center mb-8 animate-fade-in">
                <h3 className="text-3xl font-bold mb-4 text-green-800">Parent Community</h3>
                <p className="text-lg text-gray-600">Connect with other parents on the same journey</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-green-100 to-blue-100 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
                      💬 Discussion Forums
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Share experiences, ask questions, and get support from other parents navigating similar challenges.
                    </p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-bold">
                      <Users className="mr-2" size={16} />
                      Join Community
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-100 to-pink-100 animate-fade-in delay-300">
                  <CardHeader>
                    <CardTitle className="text-2xl text-purple-800 flex items-center gap-3">
                      👩‍⚕️ Expert Q&A
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Get answers from registered dietitians, pediatricians, and child development specialists.
                    </p>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold">
                      <BookOpen className="mr-2" size={16} />
                      Ask an Expert
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 animate-fade-in delay-500">
                <CardContent className="p-8 text-center">
                  <h4 className="text-2xl font-bold mb-4 text-orange-800">
                    📰 Monthly Newsletter
                  </h4>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Stay updated with the latest research, seasonal recipes, and parenting tips delivered straight to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ParentsPage;
