import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Home, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import * as faceapi from 'face-api.js';

// Tipe untuk filter
interface FilterData {
  id: string;
  name: string;
  emoji?: string;
  imageSrc?: string;
  description: string;
  getFilterProps?: (
    detectionWithLandmarks: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>, 
    canvasElement: HTMLCanvasElement,
    filterImages: Record<string, HTMLImageElement> // Tambahkan filterImages
  ) => FilterRenderProps | null;
}

// Tipe untuk properti filter yang akan di-render
interface FilterRenderProps {
  x: number; // Pusat X filter
  y: number; // Pusat Y filter
  width: number; 
  height: number; 
  rotation?: number; // Rotasi dalam radian
  visible: boolean;
}

const MODEL_URL = '/models'; 

const TeensPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterData | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Memuat model deteksi wajah...");
  const [errorLoadingModels, setErrorLoadingModels] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [filterImages, setFilterImages] = useState<Record<string, HTMLImageElement>>({});

  const filters: FilterData[] = [
    { 
      id: 'fruit-crown', 
      name: 'Fruit Crown', 
      imageSrc: 'https://placehold.co/100x80/FFBF00/FFFFFF?text=👑&font=roboto',
      description: 'Wear a magical crown of fresh fruits!',
      getFilterProps: (detectionWithLandmarks, canvas, loadedImages) => {
        if (!detectionWithLandmarks || !canvas || !detectionWithLandmarks.landmarks) {
          return null;
        }
        
        const landmarks = detectionWithLandmarks.landmarks;
        const jawOutline = landmarks.getJawOutline();
        const leftEyeBrow = landmarks.getLeftEyeBrow();
        const rightEyeBrow = landmarks.getRightEyeBrow();

        if (jawOutline.length > 0 && leftEyeBrow.length > 0 && rightEyeBrow.length > 0) {
          const faceBox = detectionWithLandmarks.detection.box;
          const faceWidth = faceBox.width;
          const faceCenterX = faceBox.x + faceBox.width / 2;

          const highestBrowY = Math.min(...leftEyeBrow.map(p => p.y), ...rightEyeBrow.map(p => p.y));
          
          const filterImg = loadedImages['fruit-crown'];
          const imgAspectRatio = (filterImg && filterImg.naturalWidth > 0) ? filterImg.naturalWidth / filterImg.naturalHeight : 100 / 80;

          const filterWidth = faceWidth * 0.8; 
          const filterHeight = filterWidth / imgAspectRatio;
          const filterCenterY = highestBrowY - (filterHeight * 0.55); 

          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          let rotation = 0;
          if (leftEye.length > 0 && rightEye.length > 0) {
            const eyeCenterLeft = leftEye.reduce((acc, p) => ({x: acc.x + p.x, y: acc.y + p.y}), {x:0, y:0});
            eyeCenterLeft.x /= leftEye.length; eyeCenterLeft.y /= leftEye.length;
            const eyeCenterRight = rightEye.reduce((acc, p) => ({x: acc.x + p.x, y: acc.y + p.y}), {x:0, y:0});
            eyeCenterRight.x /= rightEye.length; eyeCenterRight.y /= rightEye.length;
            rotation = Math.atan2(eyeCenterRight.y - eyeCenterLeft.y, eyeCenterRight.x - eyeCenterLeft.x);
          }
          
          return {
            x: faceCenterX,
            y: filterCenterY, 
            width: filterWidth,
            height: filterHeight || filterWidth * 0.7,
            rotation, 
            visible: true,
          };
        }
        return null;
      }
    },
    { 
      id: 'milk-mustache', 
      name: 'Milk Mustache', 
      imageSrc: 'https://placehold.co/120x40/FFFFFF/000000?text=Mustache&font=roboto',
      description: 'Classic milk mustache for strong bones!',
      getFilterProps: (detectionWithLandmarks, canvas, loadedImages) => {
          if (!detectionWithLandmarks || !canvas || !detectionWithLandmarks.landmarks) return null;
          const landmarks = detectionWithLandmarks.landmarks;
          const mouth = landmarks.getMouth(); 
          const nose = landmarks.getNose();

          if (mouth.length > 8 && nose.length > 6) { 
              const upperLipCenter = mouth[3]; 
              const noseBottomCenter = nose[6];    
              if(!upperLipCenter || !noseBottomCenter) return null;

              const faceWidth = detectionWithLandmarks.detection.box.width;
              const filterWidth = faceWidth * 0.5;
              const filterImg = loadedImages['milk-mustache'];
              const imgAspectRatio = (filterImg && filterImg.naturalWidth > 0) ? filterImg.naturalWidth / filterImg.naturalHeight : 120/40;
              const filterHeight = filterWidth / imgAspectRatio;
              
              const mouthLeftPoint = mouth[0];  
              const mouthRightPoint = mouth[6]; 
              let rotation = 0;
              if(mouthLeftPoint && mouthRightPoint) {
                rotation = Math.atan2(mouthRightPoint.y - mouthLeftPoint.y, mouthRightPoint.x - mouthLeftPoint.x);
              }

              return {
                  x: (mouthLeftPoint.x + mouthRightPoint.x) / 2, 
                  y: (noseBottomCenter.y + upperLipCenter.y) / 2 + (filterHeight * 0.1), 
                  width: filterWidth,
                  height: filterHeight,
                  rotation: rotation,
                  visible: true
              };
          }
          return null;
      }
    },
  ];

  const educationalContent = [
    { title: "Super Foods Comic Series", type: "comic", thumbnail: "🦸‍♀️", description: "Join Captain Carrot and the Nutrition Squad!" },
    { title: "How Your Body Uses Food", type: "video", thumbnail: "🎬", description: "Fun animated explanation of digestion" },
    { title: "Build Your Power Plate", type: "game", thumbnail: "🎮", description: "Interactive game to learn food groups" }
  ];

  useEffect(() => {
    const imagesToLoad = filters.filter(f => f.imageSrc);
    if (imagesToLoad.length === 0) {
      setFilterImages({});
      return;
    }
    const loadedImages: Record<string, HTMLImageElement> = {};
    let count = 0;
    imagesToLoad.forEach(filter => {
      if (filter.imageSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous"; 
        img.id = `filter-img-${filter.id}`;
        img.onload = () => {
          loadedImages[filter.id] = img;
          count++;
          if (count === imagesToLoad.length) {
            setFilterImages(loadedImages);
            console.log("All filter images loaded and cached in state.");
          }
        };
        img.onerror = (e) => { 
          console.error(`Failed to load image: ${filter.imageSrc}`, e);
          count++;
          if (count === imagesToLoad.length) setFilterImages(loadedImages);
        };
        img.src = filter.imageSrc;
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingMessage("Memuat model deteksi wajah (SSD Mobilenet V1)...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        setLoadingMessage("Memuat model landmark wajah (68 poin)...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setLoadingMessage("Model siap!");
        console.log("Model face-api.js berhasil dimuat.");
      } catch (error) {
        console.error("Error memuat model face-api.js:", error);
        setErrorLoadingModels(`Gagal memuat model. Error: ${error instanceof Error ? error.message : String(error)}`);
        setLoadingMessage("Gagal memuat model.");
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    if (!modelsLoaded || errorLoadingModels) {
      alert(loadingMessage || errorLoadingModels || "Model belum siap atau gagal dimuat.");
      return;
    }
    try {
      console.log("Mencoba memulai kamera...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: {} });
      setStream(mediaStream); 
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCapturing(true);
      console.log("Kamera dimulai dan stream di-set.");
    } catch (err) {
      console.error('Akses kamera ditolak:', err);
      alert('Akses kamera ditolak. Periksa izin kamera Anda.');
    }
  };

  const stopCamera = () => {
    console.log("Menghentikan kamera...");
    setIsCapturing(false); 
  };

  const drawFrame = useCallback((detectionsWithLandmarks: faceapi.WithFaceLandmarks<{detection: faceapi.FaceDetection;}>[] | undefined) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0 || !modelsLoaded) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    if(canvas.width !== displaySize.width || canvas.height !== displaySize.height){
        faceapi.matchDimensions(canvas, displaySize);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Gambar video ke canvas (TIDAK di-flip, landmark face-api.js sesuai orientasi asli)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (detectionsWithLandmarks && detectionsWithLandmarks.length > 0) {
      // Uncomment untuk debug landmark:
      // faceapi.draw.drawDetections(canvas, detectionsWithLandmarks); 
      // faceapi.draw.drawFaceLandmarks(canvas, detectionsWithLandmarks);
      
      if (activeFilter && activeFilter.getFilterProps) {
        const detection = detectionsWithLandmarks[0]; 
        const filterProps = activeFilter.getFilterProps(detection, canvas, filterImages);

        if (filterProps && filterProps.visible) {
          // console.log(`DRAW_FRAME: Menggambar filter ${activeFilter.name} dengan props:`, JSON.stringify(filterProps));
          ctx.save();
          ctx.translate(filterProps.x, filterProps.y); // x,y adalah pusat filter
          if (filterProps.rotation) {
            ctx.rotate(filterProps.rotation); 
          }
          
          const imgToDraw = filterImages[activeFilter.id];

          if (activeFilter.imageSrc && imgToDraw && imgToDraw.complete) {
            // console.log(`DRAW_FRAME: Menggambar GAMBAR untuk ${activeFilter.name}`);
            ctx.drawImage(imgToDraw, -filterProps.width / 2, -filterProps.height / 2, filterProps.width, filterProps.height);
          } else if (activeFilter.emoji) {
            // console.log(`DRAW_FRAME: Menggambar EMOJI ${activeFilter.emoji} untuk ${activeFilter.name}`);
            ctx.font = `${Math.min(filterProps.width, filterProps.height) * 0.9}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(activeFilter.emoji, 0, 0);
          }
          ctx.restore();
        }
      }
    }
  }, [activeFilter, filterImages, modelsLoaded]);


  const detectionLoop = useCallback(async () => {
    if (!isCapturing || !videoRef.current || !canvasRef.current || !modelsLoaded || videoRef.current.paused || videoRef.current.ended) {
      if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
      }
      // Jika seharusnya capturing tapi loop berhenti karena kondisi video, coba lagi nanti jika isCapturing true
      if (isCapturing && modelsLoaded) { 
          animationFrameId.current = requestAnimationFrame(detectionLoop);
      }
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < video.HAVE_ENOUGH_DATA) {
        animationFrameId.current = requestAnimationFrame(detectionLoop); 
        return;
    }

    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks();
    
    drawFrame(detections); 
    animationFrameId.current = requestAnimationFrame(detectionLoop);

  }, [isCapturing, modelsLoaded, drawFrame]); // activeFilter dihapus dari sini, karena sudah jadi dependensi drawFrame


  // useEffect untuk mengelola stream video
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const videoNode = videoRef.current;

    if (isCapturing && stream && videoNode) {
        if (videoNode.srcObject !== stream) { 
            videoNode.srcObject = stream;
        }
        currentStream = stream; 
        videoNode.play().catch(e => console.warn("Error play video di stream useEffect:", e));
    } else if (videoNode) {
        videoNode.srcObject = null;
    }
    // Cleanup stream saat isCapturing false atau stream null atau komponen unmount
    return () => {
        // console.log("CLEANUP: Stream useEffect. isCapturing:", isCapturing, "Stream ID:", currentStream?.id);
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            // console.log("Stream tracks dihentikan.");
        }
         if (videoNode && videoNode.srcObject) { 
            videoNode.srcObject = null;
        }
    }
  }, [isCapturing, stream]);


  // useEffect untuk memulai dan menghentikan loop deteksi utama
  useEffect(() => {
    const videoNode = videoRef.current;
    // console.log("ANIMATION_EFFECT: Check. isCapturing:", isCapturing, "modelsLoaded:", modelsLoaded, "videoReadyState:", videoNode?.readyState);
    
    // Hanya jalankan loop jika isCapturing, model sudah dimuat, dan video siap
    if (isCapturing && modelsLoaded && videoNode && videoNode.srcObject && !videoNode.paused && videoNode.readyState >= videoNode.HAVE_ENOUGH_DATA) {
      // console.log("ANIMATION_EFFECT: Memulai/Restart detection loop.");
      if (!animationFrameId.current) { // Hanya mulai jika belum ada
          animationFrameId.current = requestAnimationFrame(detectionLoop);
      }
    } else {
      // Hentikan loop jika kondisi tidak terpenuhi
      if (animationFrameId.current) {
        // console.log("ANIMATION_EFFECT: Menghentikan loop (kondisi tidak terpenuhi atau isCapturing false).");
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }
    // Cleanup saat komponen unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        // console.log("ANIMATION_EFFECT: Cleanup on unmount - Loop animasi dihentikan.");
      }
    };
  // detectionLoop akan selalu mengambil activeFilter terbaru karena closure.
  // Perubahan pada activeFilter tidak perlu secara eksplisit me-restart loop dari useEffect ini,
  // karena detectionLoop sendiri adalah useCallback yang akan diperbarui jika activeFilter berubah,
  // dan loop requestAnimationFrame akan terus memanggil versi terbaru detectionLoop.
  // Namun, jika detectionLoop sendiri adalah dependensi, maka perubahan activeFilter akan memicu effect ini.
  }, [isCapturing, modelsLoaded, stream, videoRef.current?.readyState, detectionLoop]); 
  

  const capturePhoto = () => {
    // Implementasi capture photo dengan canvas
    if (!canvasRef.current) {
        alert("Canvas tidak siap.");
        return;
    }
    const image = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `nutrigrowthy-faceapi-filter.png`;
    link.click();
  };

  if (errorLoadingModels) {
    return <div className="flex items-center justify-center h-screen text-red-500 p-4 text-center">{errorLoadingModels}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <Home size={20} /> Back Home
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

      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold mb-4 text-purple-800">
              📱 AR Photo Magic
            </h3>
            <p className="text-lg text-gray-600">
              {!modelsLoaded ? loadingMessage : "Pick a filter and take the coolest nutrition-themed photos ever!"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Card className="overflow-hidden shadow-2xl border-4 border-purple-300 animate-scale-in">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center relative overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute opacity-0 w-px h-px" 
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain"
                    />
                    
                    {!isCapturing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-200/70 p-8">
                        <Camera size={80} className="mx-auto mb-4 text-purple-600" />
                        <p className="text-lg font-semibold text-purple-800 mb-4">
                          {modelsLoaded ? "Ready for some photo fun?" : loadingMessage}
                        </p>
                        <Button
                          onClick={startCamera}
                          disabled={!modelsLoaded || !!errorLoadingModels}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-bold rounded-full transform hover:scale-105 transition-all duration-300"
                        >
                          <Camera className="mr-2" />
                          {modelsLoaded ? "Start Camera" : "Loading Models..."}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isCapturing && (
                    <div className="p-4 bg-white flex flex-col sm:flex-row justify-center items-center gap-4">
                      <Button
                        onClick={capturePhoto}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold"
                      >
                        📸 Capture Magic!
                      </Button>
                       <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-full font-bold"
                      >
                        Stop Camera
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div style={{ display: 'none' }}>
                {filters.filter(f => f.imageSrc).map(f => 
                  <img id={`filter-img-${f.id}`} src={f.imageSrc} alt={f.name} key={`preload-${f.id}`} />
                )}
              </div>
            </div>

            <div className="space-y-6 animate-fade-in delay-300">
              <h4 className="text-2xl font-bold text-purple-800 text-center">
                Choose Your Filter Magic! ✨
              </h4>
              <div className="grid gap-4">
                {filters.map((filter) => (
                  <Card
                    key={filter.id}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      activeFilter?.id === filter.id ? 'ring-4 ring-purple-400 bg-purple-50' : 'hover:shadow-lg'
                    } ${(!isCapturing || !modelsLoaded) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (!isCapturing || !modelsLoaded) {
                            alert("Mulai kamera dan pastikan model siap terlebih dahulu!");
                            return;
                        }
                        console.log(`Filter ${filter.name} selected.`);
                        setActiveFilter(filter);
                    }}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="text-4xl">{filter.emoji || (filter.imageSrc && <img src={filter.imageSrc} alt={filter.name} className="w-10 h-10 object-contain"/>)}</div>
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
