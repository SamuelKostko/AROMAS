'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError('Contraseña incorrecta.');
        return;
      }

      router.push('/');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-50 border border-neutral-200 rounded-sm p-6">
        <h1 className="font-display text-3xl text-foreground mb-2">Administrador</h1>
        <p className="font-sans text-sm text-neutral-600 mb-6">
          Ingresa la contraseña para habilitar el modo de edición del catálogo.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-3 py-3 border border-neutral-200 rounded-sm bg-background font-sans text-sm"
            autoFocus
          />

          {error && <p className="font-sans text-sm text-neutral-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full bg-foreground text-background py-3 rounded-sm font-sans font-semibold tracking-wide hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
