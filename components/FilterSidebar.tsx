'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { categories } from '@/lib/art-data';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 p-4 bg-foreground text-background rounded-full shadow-2xl"
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal className="w-6 h-6" />
      </motion.button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-8">
          <FilterContent
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-background z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-2xl text-foreground">Filtros</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    aria-label="Cerrar filtros"
                  >
                    <X className="w-6 h-6 text-foreground" />
                  </button>
                </div>
                <FilterContent
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterContent({
  selectedCategory,
  onCategoryChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">Categoría</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ x: 4 }}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-left px-4 py-2 rounded-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-foreground text-background font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <span className="font-sans text-sm tracking-wide">{category}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-200 pt-6">
        <p className="font-sans text-xs text-neutral-500 leading-relaxed">
          Todas las obras están disponibles para compra inmediata o pueden ser reservadas
          mediante consulta vía WhatsApp.
        </p>
      </div>
    </div>
  );
}
