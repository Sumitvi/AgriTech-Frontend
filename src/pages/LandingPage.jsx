import React, { Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';

// 🔹 Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Parallax, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { 
  Sprout, 
  CheckCircle2, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Wallet, 
  MapPin,
  ChevronDown
} from 'lucide-react';

// 🔹 3D Background with Dynamic Colors
const Background3D = ({ activeIndex }) => {
  const meshRef = useRef();
  
  const colors = ["#16a34a", "#3b82f6", "#10b981", "#059669"];
  const currentColor = colors[activeIndex] || colors[0];

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.6}>
        <MeshDistortMaterial
          color={currentColor}
          speed={3}
          distort={0.4}
          radius={1}
          emissive={currentColor}
          emissiveIntensity={0.2}
          opacity={0.15}
          transparent
        />
      </Sphere>
    </Float>
  );
};

const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* 🔹 Fixed 3D Stage */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <Canvas shadow={false}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <Suspense fallback={null}>
            <Background3D activeIndex={activeIndex} />
          </Suspense>
        </Canvas>
      </div>

      {/* 🔹 Fixed Navbar */}
      <nav className="fixed top-0 w-full z-[100] px-6 md:px-12 py-5 flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-2xl text-white shadow-lg shadow-green-200">
            <Sprout size={26} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">AgriSmart</span>
        </div>
        <div className="flex items-center gap-8">
          <button className="hidden md:flex items-center gap-2 text-xs font-black text-slate-400 hover:text-green-600 transition-all tracking-widest">
            <Globe size={16} /> EN / हिंदी
          </button>
          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-slate-900 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 transition-all active:scale-95">
            Join the Network
          </Link>
        </div>
      </nav>

      {/* 🔹 Swiper Slider */}
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        mousewheel={true}
        parallax={true}
        speed={1400}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        pagination={{ clickable: true }}
        modules={[Mousewheel, Pagination, Parallax, Autoplay]}
        className="h-screen w-full z-10"
      >
        
        {/* SLIDE 01: Hero - Fixed padding-top to prevent navbar overlap */}
        <SwiperSlide className="relative flex items-center px-6 md:px-24 pt-20">
          <div className="max-w-5xl" data-swiper-parallax="-600">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-green-600 text-[10px] font-black uppercase tracking-widest shadow-sm mb-8">
              <TrendingUp size={14} /> Empowering 10M+ Farmers
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-8 text-slate-900" data-swiper-parallax="-400">
              GROWTH <br /> <span className="text-green-600">REIMAGINED.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed" data-swiper-parallax="-200">
              Direct digital bridge between your farm and the global market. Sell at premium rates, buy quality supplies, and get paid instantly.
            </p>
            <div className="mt-12" data-swiper-parallax="-100">
               <div className="animate-bounce inline-block">
                  <ChevronDown className="text-slate-300" size={32} />
               </div>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 02: Marketplace */}
        <SwiperSlide className="relative flex items-center px-6 md:px-24 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 w-full items-center">
            <div data-swiper-parallax="-400">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-slate-900">
                MARKET <br /> <span className="text-blue-600 uppercase">Insights.</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-md mb-10 leading-relaxed font-medium">
                Eliminate the middle-man. Access real-time Mandi rates and Government MSP to ensure you never undersell.
              </p>
              <div className="flex gap-4">
                <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                   <BarChart3 className="text-blue-500 mb-4" size={32} />
                   <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Real-time Rates</h4>
                </div>
                <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                   <MapPin className="text-rose-500 mb-4" size={32} />
                   <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Regional Data</h4>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex h-[450px] bg-white rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden items-center justify-center p-12" data-swiper-parallax="-200">
               <div className="text-slate-50 text-9xl font-black absolute select-none">DATA</div>
               <div className="relative z-10 w-full">
                  <BarChart3 size={120} className="mx-auto text-blue-100 animate-pulse" />
               </div>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 03: Payouts */}
        <SwiperSlide className="relative flex items-center px-6 md:px-24 pt-20">
          <div className="max-w-4xl mx-auto text-center" data-swiper-parallax="-300">
            <div className="bg-green-600 p-6 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-200">
               <Wallet className="text-white" size={40} />
            </div>
            <h2 className="text-6xl md:text-[7.5rem] font-black tracking-tighter mb-8 leading-none text-slate-900">
              INSTANT <br /> <span className="text-green-600">PAYOUTS.</span>
            </h2>
            <p className="text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              Secure escrow settlement. Funds reach your bank account within 24 hours of trade completion. No delays.
            </p>
            <div className="flex justify-center gap-8 items-center">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck className="text-blue-500" /> ISO Certified
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <CheckCircle2 className="text-green-500" /> 100% Secured
               </div>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 04: Join Now */}
        <SwiperSlide className="relative flex items-center justify-center px-6 pt-20">
          <div className="w-full max-w-6xl bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-slate-300">
             <div className="relative z-10" data-swiper-parallax="-200">
                <h2 className="text-5xl md:text-[6rem] font-black text-white leading-none mb-8 tracking-tighter">READY TO <br /> <span className="text-green-500 underline decoration-green-500/30">GROW?</span></h2>
                <p className="text-slate-400 text-xl mb-12 max-w-lg mx-auto font-medium leading-relaxed">Join the next generation of agriculture. Create your account in minutes.</p>
                <Link to="/register" className="inline-flex items-center gap-3 bg-green-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-green-500 transition-all shadow-xl shadow-green-900/20">
                   Start Your Journey <ArrowRight size={26} />
                </Link>
             </div>
             <Sprout size={400} className="absolute right-[-10%] top-[-10%] text-white/[0.03] rotate-12" />
          </div>
        </SwiperSlide>

      </Swiper>

      {/* 🔹 Global Price Ticker */}
      <div className="fixed bottom-0 w-full z-50 bg-white/80 backdrop-blur-md border-t border-slate-200 py-5 overflow-hidden whitespace-nowrap">
         <div className="flex gap-20 animate-pulse px-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            <span>WHEAT: ₹2,450</span>
            <span>MAIZE: ₹1,960</span>
            <span>PADDY: ₹2,180</span>
            <span className="text-green-600 font-black">COTTON: ₹6,800 ↑</span>
            <span>SOYBEAN: ₹4,200</span>
            <span>WHEAT: ₹2,450</span>
         </div>
      </div>

    </div>
  );
};

export default LandingPage;