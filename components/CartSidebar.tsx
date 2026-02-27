'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { generateWhatsAppMessage } from '@/lib/checkout-utils';

export default function CartSidebar() {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();

  const totalPrice = getTotalPrice();

  const handleWhatsAppCheckout = () => {
    const whatsappUrl = generateWhatsAppMessage(items, totalPrice);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="font-display text-2xl text-foreground">Tu Carrito</h2>
                <p className="font-sans text-sm text-neutral-600 mt-1">
                  {items.length} {items.length === 1 ? 'vela' : 'velas'}
                </p>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      >
                      🕯️
                    </motion.div>
                  </div>
                  <p className="font-sans text-neutral-600 mb-2">Tu carrito está vacío</p>
                  <p className="font-sans text-sm text-neutral-500">
                    Explora nuestro catálogo y descubre velas únicas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-neutral-50 rounded-sm p-4"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-base text-foreground truncate">
                            {item.title}
                          </h3>
                          <p className="font-sans text-sm font-semibold text-foreground mt-2">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-neutral-200 rounded-full transition-colors self-start"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-neutral-600" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-sans text-sm text-neutral-600">Cantidad</span>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 rounded-full transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-4 h-4 text-foreground" />
                          </motion.button>
                          <span className="font-sans text-base font-semibold text-foreground w-8 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 rounded-full transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4 text-foreground" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-foreground">Total</span>
                  <span className="font-display text-2xl text-foreground">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-sm font-sans font-semibold tracking-wide transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Consultar por WhatsApp</span>
                </motion.button>

                <p className="font-sans text-xs text-center text-neutral-500">
                  Te contactaremos para confirmar disponibilidad y coordinar el envío
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
