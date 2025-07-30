"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Instagram, Github, Mail, Linkedin, Code, Atom, Palette, Layers, Music, Play, Brain, Globe, Sparkles, Database, Cpu } from 'lucide-react';
import { usePlayer } from '@/app/context/PlayerContext';
import { useAnalytics } from '@/hooks/useAnalytics';

const DevInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { activeTrack } = usePlayer();
  const { trackSocialClick, trackProfilePhotoClick, trackButtonClick } = useAnalytics();

  useEffect(() => {
    // Show the floating icon after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/rendyy_404',
      icon: <Instagram size={14} />,
      bgColor: 'bg-primary'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/rendydev404',
      icon: <Github size={14} />,
      bgColor: 'bg-primary'
    },
    {
      name: 'Email',
      url: 'mailto:irawanrendy55@gmail.com',
      icon: <Mail size={14} />,
      bgColor: 'bg-primary'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/rendi-irawan-93190732b/',
      icon: <Linkedin size={14} />,
      bgColor: 'bg-primary'
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      <div className={`fixed left-4 md:left-8 z-[45] transition-all duration-300 ease-in-out
        ${activeTrack 
          ? 'bottom-[10rem] md:bottom-24' // 1rem di atas player
          : 'bottom-20 md:bottom-8'
        }`
      }>
      {/* Particle Effects - Simplified */}
      <AnimatePresence>
        {isOpen && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating Icon */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5
        }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          boxShadow: "0 0 30px rgba(96, 22, 255, 0.5)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-primary text-white rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white"
        >
          {isOpen ? <X size={28} /> : <User size={28} />}
        </motion.div>
        
        {/* Pulse effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary rounded-full opacity-20"
        />

        {/* Glow effect */}
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(96, 22, 255, 0.3)",
              "0 0 40px rgba(96, 22, 255, 0.6)",
              "0 0 20px rgba(96, 22, 255, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
        />
      </motion.button>

      {/* Developer Info Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.2
            }}
            className="absolute bottom-20 left-0 w-64 md:w-72 bg-black/90 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            
            {/* Profile Section */}
            <div className="relative p-4">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                  className="relative cursor-pointer"
                  onClick={() => {
                  setShowImageModal(true);
                  trackProfilePhotoClick();
                }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/40 shadow-lg bg-gradient-to-br from-blue-500/20 to-blue-500/40 flex items-center justify-center relative hover:ring-blue-500/60 transition-all duration-300">
                    {/* Fallback background dengan gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-500/40" />
                    
                    {/* Fallback emoji jika gambar error */}
                    {imageError && (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 text-2xl font-bold z-10">
                        👨‍💻
                      </div>
                    )}
                    
                    <Image
                      src="/pp1.jpg"
                      alt="Developer Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      priority
                      sizes="40px"
                      onLoad={(e) => {
                        // Pastikan gambar ter-load dengan benar
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                        setImageLoaded(true);
                        setImageError(false);
                      }}
                      onError={() => {
                        // Fallback jika gambar tidak ditemukan
                        setImageError(true);
                        setImageLoaded(false);
                      }}
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"
                  />
                  
                  {/* Glow effect */}
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 8px rgba(34, 197, 94, 0.4)",
                        "0 0 16px rgba(34, 197, 94, 0.6)",
                        "0 0 8px rgba(34, 197, 94, 0.4)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  />
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-bold text-white"
                  >
                    Rendy Irawan
                  </motion.h3>
                  <motion.p
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white font-bold text-xs"
                  >
                    Full Stack Developer
                  </motion.p>
                </div>
              </div>

              {/* Tech Stack */}   
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <p className="text-gray-300 text-xs mb-2 leading-relaxed">
                  Built with modern technologies:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md border border-blue-500/30 flex items-center gap-1">
                    <Code size={12} />
                    Next.js
                  </span>
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-md border border-blue-600/30 flex items-center gap-1">
                    <Atom size={12} />
                    React
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md border border-purple-500/30 flex items-center gap-1">
                    <Code size={12} />
                    TypeScript
                  </span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-md border border-cyan-500/30 flex items-center gap-1">
                    <Palette size={12} />
                    Tailwind CSS
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-md border border-green-500/30 flex items-center gap-1">
                    <Sparkles size={12} />
                    Framer Motion
                  </span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-md border border-yellow-500/30 flex items-center gap-1">
                    <Music size={12} />
                    Spotify API
                  </span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-md border border-red-500/30 flex items-center gap-1">
                    <Play size={12} />
                    YouTube API
                  </span>
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-md border border-indigo-500/30 flex items-center gap-1">
                    <Cpu size={12} />
                    Gemini API
                  </span>
                </div>
              </motion.div>

              {/* Social Links */}
              <div className="space-y-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackSocialClick(social.name.toLowerCase())}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ 
                      x: 3, 
                      scale: 1.01
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group border border-white/10 hover:border-white/20"
                  >
                    <motion.div 
                      className={`w-7 h-7 rounded-lg ${social.bgColor} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-200`}
                      whileHover={{ rotate: 3, scale: 1.05 }}
                    >
                      {social.icon}
                    </motion.div>
                    <span className="text-white font-medium group-hover:text-blue-500/80 transition-colors duration-200 text-xs">
                      {social.name}
                    </span>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="ml-auto text-blue-500/60 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      →
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            </div>

                        {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative px-4 py-2 bg-white/5 border-t border-white/10"
            >
              <p className="text-center text-xs text-gray-400">
                Spotify Clone By Rendy Irawan 🚀
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
              className="relative max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl ring-4 ring-blue-500/30">
                <Image
                  src="/pp1.jpg"
                  alt="Developer Profile"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 80px) 50vw, 50px"
                />
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DevInfo; 