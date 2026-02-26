'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';
import { Artwork } from '@/lib/art-data';
import { useCartStore } from '@/lib/cart-store';
import Link from 'next/link';

interface ArtCardProps {
  artwork: Artwork;
  index: number;
}

export default function ArtCard({ artwork, index }: ArtCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(artwork);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/artwork/${artwork.id}`} className="block">
        <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4] rounded-sm">
          {/* Image */}
          <motion.img
            src={artwork.image}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
          )}

          {/* Availability Badge */}
          {artwork.availability !== 'available' && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-foreground/90 text-background text-xs font-sans tracking-wide rounded-full">
                {artwork.availability === 'reserved' ? 'Reservado' : 'Vendido'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className="p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg"
              aria-label="Favorito"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
                }`}
              />
            </motion.button>
            {artwork.availability === 'available' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 bg-foreground/90 backdrop-blur-sm rounded-full shadow-lg"
                aria-label="Añadir al carrito"
              >
                <ShoppingBag className="w-5 h-5 text-background" />
              </motion.button>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-display text-lg sm:text-xl text-foreground truncate">
                {artwork.title}
              </h3>
              <p className="font-sans text-sm text-neutral-600 truncate">
                {artwork.artist}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-sans text-base sm:text-lg font-semibold text-foreground">
                ${artwork.price.toLocaleString()}
              </p>
              <p className="font-sans text-xs text-neutral-500">
                {artwork.currency}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-neutral-500">
            <span>{artwork.medium}</span>
            <span>•</span>
            <span>
              {artwork.dimensions.width}×{artwork.dimensions.height} {artwork.dimensions.unit}
            </span>
          </div>

          <div className="pt-2">
            <span className="inline-block px-2 py-1 bg-accent-cream text-foreground text-xs font-sans tracking-wide rounded">
              {artwork.category}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
