'use client';

import { useState } from 'react';
import type { Course } from '@/lib/courses-storage';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { SITE } from '@/lib/site';

interface Props {
  course: Course;
  onClose: () => void;
}

export default function CourseEnrollModal({ course, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();

    const adminPhone = SITE.whatsappPhone;
    const message = `Hola, me gustaría inscribirme en el curso:
*${course.theme}*
Fecha: ${course.date}
Hora: ${course.time}
Precio: ${formatPrice(course.price)}

*Mis datos:*
Nombre: ${name}
Teléfono: ${phone}
Correo: ${email}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-100">
          <h2 className="text-xl font-display text-foreground font-semibold">Inscripción al curso</h2>
          <button onClick={onClose} className="p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleEnroll} className="p-6 space-y-4">
          <div className="p-4 bg-neutral-50 rounded-md border border-neutral-100 mb-6">
            <p className="font-semibold text-foreground">{course.theme}</p>
            <p className="text-sm text-neutral-600 mt-1">Precio: <span className="font-medium text-foreground">{formatPrice(course.price)}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-md font-semibold hover:bg-[#1ebd5b] transition-colors"
          >
            <Send size={18} />
            Enviar por WhatsApp
          </button>
        </form>
      </motion.div>
    </div>
  );
}
