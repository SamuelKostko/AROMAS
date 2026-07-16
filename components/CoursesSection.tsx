'use client';

import { useEffect, useState } from 'react';
import type { Course } from '@/lib/courses-storage';
import { formatPrice } from '@/lib/utils';
import { Calendar, Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CourseEnrollModal from './CourseEnrollModal';

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json() as Course[];
          setCourses(data.filter((c) => c.isActive));
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading || courses.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-16 lg:my-20 relative overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl px-6 py-16 lg:px-16 lg:py-24"
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6">
            <Sparkles size={16} className="text-yellow-300" />
            <span>Nuevos Talleres</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Descubre el arte de <br className="hidden lg:block"/> crear velas.
          </h2>
          <p className="font-sans text-lg lg:text-xl text-neutral-300">
            Únete a nuestros cursos especializados y desarrolla tu creatividad. Aprende técnicas únicas para hacer tus propias velas aromáticas.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {courses.map((course, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * idx }}
            key={course.id} 
            className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-white/10 rounded-2xl text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                <BookOpen size={28} />
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                {formatPrice(course.price)}
              </span>
            </div>
            
            <h3 className="font-display text-2xl text-white mb-6 line-clamp-2">
              {course.theme}
            </h3>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-neutral-300 font-sans">
                <Calendar size={18} className="mr-3 opacity-70" />
                <span>{course.date}</span>
              </div>
              <div className="flex items-center text-neutral-300 font-sans">
                <Clock size={18} className="mr-3 opacity-70" />
                <span>{course.time}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCourse(course)}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-semibold hover:bg-neutral-200 transition-colors group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Inscribirse Ahora
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      {selectedCourse && (
        <CourseEnrollModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </motion.div>
  );
}
