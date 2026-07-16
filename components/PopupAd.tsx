'use client';

import { useEffect, useState } from 'react';
import type { AdData } from '@/lib/ad-storage';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function PopupAd() {
  const [ad, setAd] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ad');
        if (res.ok) {
          const data = await res.json() as AdData;
          if (data.isActive && data.imageUrl) {
            setAd(data);
            setIsVisible(true);
          }
        }
      } catch (err) {
        console.error('Failed to load ad', err);
      }
    })();
  }, []);

  if (!isVisible || !ad) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 text-white hover:bg-black/80 rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
          
          <div 
            className="relative w-full aspect-square cursor-pointer"
            onClick={() => {
              if (ad.linkUrl) {
                window.open(ad.linkUrl, '_blank');
              }
            }}
          >
            {/* Using img tag to support external domains without next/image config issues */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={ad.imageUrl} 
              alt="Anuncio" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
