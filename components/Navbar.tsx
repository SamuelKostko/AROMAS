'use client';

import { Instagram, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-neutral-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/logo.png"
                  alt="HYOSS_ART"
                  width={128}
                  height={128}
                  className="w-8 h-8 rounded-sm object-contain"
                  priority
                />
                <span className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                  HYOSS_ART
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="font-sans text-sm tracking-wide text-foreground hover:text-neutral-600 transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/sobre-nosotros"
                className="font-sans text-sm tracking-wide text-foreground hover:text-neutral-600 transition-colors"
              >
                Sobre Nosotros
              </Link>
            </div>

            {/* Instagram + Cart */}
            <div className="flex items-center space-x-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/hyoss_art?igsh=ZHczMmt0eTYyOWpo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Abrir carrito"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Menú"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 sm:top-20 left-0 right-0 z-30 bg-background border-b border-neutral-200 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block font-sans text-base text-foreground hover:text-neutral-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/sobre-nosotros"
                className="block font-sans text-base text-foreground hover:text-neutral-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
