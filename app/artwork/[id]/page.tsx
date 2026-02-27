'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Artwork } from '@/lib/art-data';
import { useCartStore } from '@/lib/cart-store';
import { SITE } from '@/lib/site';

export default function ArtworkDetail() {
  const params = useParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareLabel, setShareLabel] = useState('Compartir');
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const artworkId = String((params as { id?: string }).id ?? '');
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!artworkId) return;

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/artworks/${artworkId}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as Artwork;
        if (!cancelled) setArtwork(data);
      } catch {
        if (!cancelled) setArtwork(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  if (isLoading && !artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-sans text-neutral-600">Cargando producto…</p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl text-foreground mb-4">Producto no encontrado</h2>
          <button
            onClick={() => router.push('/')}
            className="font-sans text-neutral-600 hover:text-foreground transition-colors"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(artwork);
    toggleCart();
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;

    const shareData = {
      title: artwork.title,
      text: `Mira este producto en ${SITE.brandName}: ${artwork.title}`,
      url,
    };

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
        const canShare =
          !('canShare' in navigator) ||
          typeof navigator.canShare !== 'function' ||
          navigator.canShare(shareData);

        if (canShare) {
          await navigator.share(shareData);
          return;
        }
      }
    } catch {
      // Ignore share cancellation/errors and fallback to clipboard.
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareLabel('Copiado');
        window.setTimeout(() => setShareLabel('Compartir'), 1500);
        return;
      }
    } catch {
      // Fall through to prompt.
    }

    window.prompt('Copia este enlace:', url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-neutral-600 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-sans text-sm">Volver al catálogo</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Actions */}
            <div className="flex items-center justify-between mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
                  }`}
                />
                <span className="font-sans text-sm text-foreground">
                  {isFavorite ? 'En favoritos' : 'Guardar'}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => void handleShare()}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Compartir"
              >
                <Share2 className="w-5 h-5 text-foreground" />
                <span className="font-sans text-sm text-foreground">{shareLabel}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-3">
                {artwork.title}
              </h1>
              <div className="flex items-baseline space-x-2">
                <span className="font-display text-4xl text-foreground">
                  ${artwork.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5 text-foreground" />
                <h2 className="font-display text-xl text-foreground">Descripción</h2>
              </div>
              <p className="font-sans text-base text-neutral-700 leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-foreground text-background py-4 rounded-sm font-sans font-semibold tracking-wide hover:bg-neutral-800 transition-colors"
              >
                Añadir al carrito
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
