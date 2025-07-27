"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Instagram, Github, Mail, Linkedin } from 'lucide-react';
import { usePlayer } from '@/app/context/PlayerContext';

const DevInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { activeTrack } = usePlayer();

  useEffect(() => {
    // Show the floating icon after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/yourusername',
      icon: <Instagram size={16} />,
      bgColor: 'bg-gradient-to-br from-pink-500 to-red-500'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/yourusername',
      icon: <Github size={16} />,
      bgColor: 'bg-gradient-to-br from-gray-800 to-black'
    },
    {
      name: 'Email',
      url: 'mailto:your.email@example.com',
      icon: <Mail size={16} />,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yourusername',
      icon: <Linkedin size={16} />,
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-800'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className={`fixed left-4 md:left-8 z-[45] transition-all duration-300 ease-in-out
      ${activeTrack 
        ? 'bottom-[10rem] md:bottom-24' // 1rem di atas player
        : 'bottom-20 md:bottom-8'
      }`
    }>
      {/* Particle Effects */}
      <AnimatePresence>
        {isOpen && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0, 
                  opacity: 0 
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 100,
                  y: Math.sin(i * 60 * Math.PI / 180) * 100,
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                                 className="absolute w-2 h-2 bg-primary rounded-full"
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
            initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }}
            className="absolute bottom-20 left-0 w-72 md:w-80 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10" />
            
            {/* Profile Section */}
            <div className="relative p-4 md:p-6">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <Image
                      src="/pp1.jpg"
                      alt="Developer Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      priority
                      sizes="(max-width: 768px) 48px, 64px"
                      onError={(e) => {
                        // Fallback jika gambar tidak ditemukan
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">👨‍💻</div>';
                        }
                      }}
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                  />
                  
                  {/* Profile glow */}
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 10px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 10px rgba(34, 197, 94, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"
                  />
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-lg font-bold text-white"
                  >
                    Your Name
                  </motion.h3>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-primary/80 text-xs md:text-sm"
                  >
                    Full Stack Developer
                  </motion.p>
                </div>
              </div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed"
              >
                Passionate developer creating amazing digital experiences. 
                Love building with modern technologies and pushing the boundaries of what's possible.
              </motion.p>

              {/* Social Links */}
              <div className="space-y-2 md:space-y-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ 
                      x: 5, 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/10 hover:border-white/20"
                  >
                    <motion.div 
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${social.bgColor} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {social.icon}
                    </motion.div>
                    <span className="text-white font-medium group-hover:text-primary/80 transition-colors duration-300 text-xs md:text-sm">
                      {social.name}
                    </span>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="ml-auto text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ x: 3 }}
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
              transition={{ delay: 1 }}
              className="relative px-4 md:px-6 py-2 md:py-3 bg-white/5 border-t border-white/10"
            >
              <p className="text-center text-xs text-gray-400">
                Made with ❤️ using Next.js & Framer Motion
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DevInfo; 