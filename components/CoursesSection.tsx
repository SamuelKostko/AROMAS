'use client';

import { useEffect, useState } from 'react';
import type { Course } from '@/lib/courses-storage';
import { formatPrice } from '@/lib/utils';
import { Calendar, Clock, BookOpen } from 'lucide-react';
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
    <div className="my-16 lg:my-24">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
          Nuestros Cursos
        </h2>
        <p className="font-sans text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0">
          Aprende el arte de hacer velas con nuestros talleres especializados. Inscríbete y desarrolla una nueva habilidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-neutral-100 rounded-full">
                  <BookOpen size={24} className="text-neutral-800" />
                </div>
                <span className="font-semibold text-lg text-foreground">{formatPrice(course.price)}</span>
              </div>
              <h3 className="font-display text-xl text-foreground mb-4">{course.theme}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-neutral-600 text-sm">
                  <Calendar size={16} className="mr-2" />
                  <span>{course.date}</span>
                </div>
                <div className="flex items-center text-neutral-600 text-sm">
                  <Clock size={16} className="mr-2" />
                  <span>{course.time}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                className="w-full bg-foreground text-background py-2.5 rounded-md font-semibold hover:bg-neutral-800 transition-colors"
              >
                Inscribirse
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <CourseEnrollModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}
