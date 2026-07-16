'use client';

import { useState, useEffect } from 'react';
import type { Course } from '@/lib/courses-storage';
import type { AdData } from '@/lib/ad-storage';

export default function AdminPanel() {
  const [ad, setAd] = useState<AdData>({ imageUrl: '', linkUrl: '', isActive: false });
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [isSavingAd, setIsSavingAd] = useState(false);
  const [isUploadingAdImage, setIsUploadingAdImage] = useState(false);

  const [courseDraft, setCourseDraft] = useState<Partial<Course>>({
    theme: '',
    date: '',
    time: '',
    price: 0,
    isActive: true,
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  const fetchAd = async () => {
    try {
      const res = await fetch('/api/ad');
      if (res.ok) setAd(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) setCourses(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAd();
    fetchCourses();
  }, []);

  const handleUploadAdImage = async (file: File) => {
    setIsUploadingAdImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setAd(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Error subiendo imagen del anuncio');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploadingAdImage(false);
    }
  };

  const saveAd = async () => {
    setIsSavingAd(true);
    try {
      const res = await fetch('/api/ad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad),
      });
      if (res.ok) {
        alert('Publicidad guardada exitosamente');
      } else {
        alert('Error guardando publicidad');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingAd(false);
    }
  };

  const resetCourseDraft = () => {
    setEditingCourseId(null);
    setCourseDraft({ theme: '', date: '', time: '', price: 0, isActive: true });
  };

  const saveCourse = async () => {
    if (!courseDraft.theme) return alert('El tema del curso es requerido');
    
    setIsSavingCourse(true);
    try {
      const method = editingCourseId ? 'PUT' : 'POST';
      const url = editingCourseId ? `/api/courses/${editingCourseId}` : '/api/courses';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseDraft),
      });

      if (res.ok) {
        resetCourseDraft();
        await fetchCourses();
      } else {
        alert('Error guardando el curso');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingCourse(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este curso?')) return;
    setIsSavingCourse(true);
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (editingCourseId === id) resetCourseDraft();
        await fetchCourses();
      }
    } finally {
      setIsSavingCourse(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-neutral-200">
      {/* AD MANAGEMENT */}
      <div className="space-y-4">
        <h3 className="font-display text-xl text-foreground">Gestionar Publicidad (Popup)</h3>
        <div className="space-y-3 bg-white p-4 border border-neutral-200 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-neutral-600">Estado</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ad.isActive}
                onChange={e => setAd(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="font-sans text-sm">Mostrar popup</span>
            </label>
          </div>
          
          <div className="space-y-1">
            <span className="font-sans text-sm text-neutral-600">Imagen del Anuncio</span>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files?.[0]) handleUploadAdImage(e.target.files[0]);
              }}
              className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm"
              disabled={isUploadingAdImage}
            />
            {ad.imageUrl && (
              <div className="mt-2 text-xs text-green-600">Imagen actual: {ad.imageUrl.substring(0, 40)}...</div>
            )}
          </div>

          <div className="space-y-1">
            <span className="font-sans text-sm text-neutral-600">Link al hacer clic (opcional)</span>
            <input
              type="text"
              value={ad.linkUrl}
              onChange={e => setAd(prev => ({ ...prev, linkUrl: e.target.value }))}
              placeholder="https://wa.me/..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm"
            />
          </div>

          <button
            onClick={saveAd}
            disabled={isSavingAd || isUploadingAdImage}
            className="w-full px-4 py-2 bg-foreground text-background font-semibold rounded-sm disabled:opacity-50"
          >
            {isSavingAd ? 'Guardando...' : 'Guardar Publicidad'}
          </button>
        </div>
      </div>

      {/* COURSES MANAGEMENT */}
      <div className="space-y-4">
        <h3 className="font-display text-xl text-foreground">Gestionar Cursos</h3>
        <div className="space-y-3 bg-white p-4 border border-neutral-200 rounded-sm">
          <input
            type="text"
            placeholder="Temática del curso"
            value={courseDraft.theme}
            onChange={e => setCourseDraft(prev => ({ ...prev, theme: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Fecha (ej. 20 de Agosto)"
              value={courseDraft.date}
              onChange={e => setCourseDraft(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm"
            />
            <input
              type="text"
              placeholder="Hora (ej. 10:00 AM)"
              value={courseDraft.time}
              onChange={e => setCourseDraft(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <input
              type="number"
              placeholder="Precio ($)"
              value={courseDraft.price || ''}
              onChange={e => setCourseDraft(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm"
            />
            <label className="flex items-center gap-2 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={courseDraft.isActive}
                onChange={e => setCourseDraft(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="font-sans text-sm">Curso Activo</span>
            </label>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={saveCourse}
              disabled={isSavingCourse || !courseDraft.theme}
              className="flex-1 px-4 py-2 bg-foreground text-background font-semibold rounded-sm disabled:opacity-50"
            >
              {isSavingCourse ? 'Guardando...' : editingCourseId ? 'Guardar Cambios' : 'Crear Curso'}
            </button>
            {editingCourseId && (
              <button
                onClick={resetCourseDraft}
                className="px-4 py-2 border border-neutral-200 rounded-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Courses List */}
        <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-sm bg-white">
          {courses.map(course => (
            <div key={course.id} className="p-3 border-b border-neutral-100 flex justify-between items-center text-sm">
              <div>
                <div className="font-semibold">{course.theme} <span className="text-xs font-normal text-neutral-500">({course.isActive ? 'Activo' : 'Inactivo'})</span></div>
                <div className="text-xs text-neutral-600">{course.date} - {course.time} | ${course.price}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {
                  setEditingCourseId(course.id);
                  setCourseDraft(course);
                }} className="text-blue-600">Editar</button>
                <button onClick={() => deleteCourse(course.id)} className="text-red-600">Borrar</button>
              </div>
            </div>
          ))}
          {courses.length === 0 && <div className="p-3 text-sm text-neutral-500">No hay cursos</div>}
        </div>
      </div>
    </div>
  );
}
