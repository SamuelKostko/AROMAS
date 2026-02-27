'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SITE } from '@/lib/site';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Opcionalmente limpiar el carrito después de una compra exitosa
    // clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl text-foreground mb-4"
        >
          ¡Gracias por tu interés!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-sans text-lg text-neutral-600 mb-8 leading-relaxed"
        >
          Hemos recibido tu consulta. Nuestro equipo se pondrá en contacto contigo en las
          próximas 24 horas para confirmar la disponibilidad y coordinar los detalles del
          envío.
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <div className="bg-accent-cream p-6 rounded-sm text-left">
            <h3 className="font-display text-lg text-foreground mb-2">
              Próximos pasos
            </h3>
            <ul className="font-sans text-sm text-neutral-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Confirmaremos disponibilidad de las velas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Te enviaremos detalles de envío y tiempos de entrega</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Coordinaremos el método de pago seguro</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Preparamos tu pedido y coordinamos la entrega</span>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-50 p-6 rounded-sm text-left">
            <h3 className="font-display text-lg text-foreground mb-2">
              ¿Tienes preguntas?
            </h3>
            <p className="font-sans text-sm text-neutral-700 mb-3">
              No dudes en escribirnos por WhatsApp si necesitas información adicional
              sobre aromas, disponibilidad o el proceso de compra.
            </p>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors font-sans text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="w-full bg-foreground text-background py-4 rounded-sm font-sans font-semibold tracking-wide hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Volver al catálogo</span>
          </motion.button>

          <p className="font-sans text-xs text-neutral-500">
            Revisa tu bandeja de entrada - te hemos enviado un correo de confirmación
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
