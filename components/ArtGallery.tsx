'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ArtCard from './ArtCard';
import FilterSidebar from './FilterSidebar';
import { categories, priceRanges, type Artwork } from '@/lib/art-data';

type ArtworkDraft = Partial<Artwork>;

const DEFAULT_CATEGORY = categories.find((category) => category !== 'Todos') ?? 'Velas aromáticas';

function matchesPriceRange(price: number, rangeLabel: string): boolean {
  const range = priceRanges.find((r) => r.label === rangeLabel) ?? priceRanges[0];
  if (!range || range.label === 'Todos') return true;

  const minOk = range.minExclusive ? price > range.min : price >= range.min;
  const maxOk =
    range.max === Infinity
      ? true
      : range.maxInclusive
        ? price <= range.max
        : price < range.max;

  return minOk && maxOk;
}

function normalizeDraft(draft: ArtworkDraft): ArtworkDraft {
  const safePrice = Number.isFinite(Number(draft.price)) ? Number(draft.price) : 0;
  const safeCategory = String(draft.category ?? '').trim();

  return {
    ...draft,
    title: (draft.title ?? '').toString(),
    description: (draft.description ?? '').toString(),
    image: (draft.image ?? '').toString(),
    price: safePrice,
    category: safeCategory || DEFAULT_CATEGORY,
  };
}

export default function ArtGallery() {
  const [adminMode, setAdminMode] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(
    priceRanges[0]?.label ?? 'Todos'
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ArtworkDraft>(() => ({
    title: '',
    category: DEFAULT_CATEGORY,
    price: 0,
    image: '',
    description: '',
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canSaveDraft =
    !isSaving &&
    !isUploadingImage &&
    Boolean(String(draft.title ?? '').trim());

  const refreshCatalog = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/artworks', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as Artwork[];
      setArtworks(Array.isArray(data) ? data : []);
    } catch {
      setArtworks([]);
      setLoadError('No se pudo cargar el catálogo del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/admin/me', { cache: 'no-store' });
        const data = (await response.json()) as { isAdmin?: boolean };
        setAdminMode(Boolean(data?.isAdmin));
      } catch {
        setAdminMode(false);
      }
    })();

    refreshCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetDraft = () => {
    setEditingId(null);
    setDraft({
      title: '',
      category: DEFAULT_CATEGORY,
      price: 0,
      image: '',
      description: '',
    });
  };

  const startEdit = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setDraft({
      ...artwork,
      category: String(artwork.category ?? '').trim() || DEFAULT_CATEGORY,
    });
  };

  const filteredArtworks = useMemo(() => {
    const normalizedCategory = selectedCategory.trim();
    const normalizedRange = selectedPriceRange.trim();

    return artworks.filter((artwork) => {
      const artworkCategory = String(artwork.category ?? '').trim() || DEFAULT_CATEGORY;
      const matchesCategory = normalizedCategory === 'Todos' || artworkCategory === normalizedCategory;

      const numericPrice = Number(artwork.price);
      const safePrice = Number.isFinite(numericPrice) ? numericPrice : 0;
      const matchesPrice = matchesPriceRange(safePrice, normalizedRange);

      return matchesCategory && matchesPrice;
    });
  }, [artworks, selectedCategory, selectedPriceRange]);

  const saveDraft = async () => {
    const normalized = normalizeDraft(draft);
    const title = normalized.title?.trim();
    if (!title) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `/api/artworks/${editingId}` : '/api/artworks';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });

      if (!response.ok) {
        let details = '';
        try {
          const contentType = response.headers.get('content-type') ?? '';
          if (contentType.includes('application/json')) {
            const data = (await response.json()) as { error?: string; details?: string };
            details = data?.error ?? data?.details ?? '';
          } else {
            details = await response.text();
          }
        } catch {
          // ignore
        }

        setSaveError(
          `No se pudo guardar el producto (HTTP ${response.status}).${details ? ` ${details}` : ''}`
        );
        return;
      }

      await refreshCatalog();
      resetDraft();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setSaveError(`No se pudo guardar el producto. ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadArtworkImage = async (file: File) => {
    setUploadError(null);
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let details = '';
        try {
          const contentType = response.headers.get('content-type') ?? '';
          if (contentType.includes('application/json')) {
            const data = (await response.json()) as { error?: string; code?: string };
            details = data?.error ? ` ${data.error}` : '';
          } else {
            const text = await response.text();
            details = text ? ` ${text}` : '';
          }
        } catch {
          // ignore
        }

        setUploadError(`No se pudo subir la imagen (HTTP ${response.status}).${details}`);
        return;
      }

      const data = (await response.json()) as { url?: string };
      if (data?.url) {
        setDraft((d) => ({ ...d, image: data.url }));
      } else {
        setUploadError('Respuesta inválida al subir la imagen.');
      }
    } catch {
      setUploadError('No se pudo subir la imagen (error de red).');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const deleteArtwork = async (id: string) => {
    const ok = window.confirm('¿Eliminar este producto del catálogo?');
    if (!ok) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/artworks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (editingId === id) resetDraft();
      await refreshCatalog();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {adminMode && (
          <div className="mb-8 p-6 bg-neutral-50 border border-neutral-200 rounded-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-2xl text-foreground">Administrar catálogo</h2>
                <p className="font-sans text-sm text-neutral-600">
                  Modo admin activo
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshCatalog}
                  className="px-4 py-2 rounded-sm bg-background border border-neutral-200 text-foreground font-sans text-sm hover:bg-neutral-100 transition-colors"
                  disabled={isLoading || isSaving}
                >
                  Recargar
                </button>
                <button
                  onClick={resetDraft}
                  className="px-4 py-2 rounded-sm bg-background border border-neutral-200 text-foreground font-sans text-sm hover:bg-neutral-100 transition-colors"
                  disabled={isSaving}
                >
                  Nuevo
                </button>
              </div>
            </div>

            {loadError && (
              <p className="font-sans text-sm text-neutral-600 mb-4">{loadError}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={draft.title ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Nombre"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm bg-background font-sans text-sm"
                  />
                  <select
                    value={String(draft.category ?? DEFAULT_CATEGORY)}
                    onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm bg-background font-sans text-sm"
                  >
                    {categories
                      .filter((category) => category !== 'Todos')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    value={Number(draft.price ?? 0)}
                    onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
                    placeholder="Precio"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm bg-background font-sans text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-sans text-sm text-neutral-600">Imagen del producto</p>
                    {draft.image ? (
                      <p className="font-sans text-xs text-neutral-600 truncate">{draft.image}</p>
                    ) : (
                      <p className="font-sans text-xs text-neutral-600">Sin imagen</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadArtworkImage(file);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm bg-background font-sans text-sm"
                    disabled={isSaving || isUploadingImage}
                  />
                  {uploadError && (
                    <p className="font-sans text-xs text-neutral-600">{uploadError}</p>
                  )}
                  {isUploadingImage && (
                    <p className="font-sans text-xs text-neutral-600">Subiendo imagen…</p>
                  )}
                </div>

                <textarea
                  value={draft.description ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Descripción"
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm bg-background font-sans text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveDraft}
                      disabled={!canSaveDraft}
                      className="flex-1 px-4 py-2 rounded-sm bg-foreground text-background font-sans text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        {isSaving
                          ? 'Guardando…'
                          : editingId
                            ? 'Guardar cambios'
                            : 'Agregar producto'}
                    </button>
                    {editingId && (
                      <button
                        onClick={resetDraft}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-sm bg-background border border-neutral-200 text-foreground font-sans text-sm hover:bg-neutral-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                  {!String(draft.title ?? '').trim() && (
                    <p className="font-sans text-xs text-neutral-600">
                      Escribe un nombre para habilitar el botón.
                    </p>
                  )}
                  {isUploadingImage && (
                    <p className="font-sans text-xs text-neutral-600">
                      Espera a que termine la subida de la imagen.
                    </p>
                  )}
                  {saveError && (
                    <p className="font-sans text-xs text-neutral-600">{saveError}</p>
                  )}
                </div>
              </div>

              <div className="border border-neutral-200 rounded-sm bg-background">
                <div className="px-4 py-3 border-b border-neutral-200">
                  <p className="font-sans text-sm text-neutral-600">
                    Productos ({artworks.length})
                  </p>
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {artworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-sans text-sm text-foreground font-medium truncate">
                          {artwork.title}
                        </p>
                        <p className="font-sans text-xs text-neutral-600 truncate">
                          #{artwork.id} · ${artwork.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(artwork)}
                          disabled={isSaving}
                          className="px-3 py-1.5 rounded-sm bg-neutral-100 text-foreground font-sans text-xs hover:bg-neutral-200 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteArtwork(artwork.id)}
                          disabled={isSaving}
                          className="px-3 py-1.5 rounded-sm bg-neutral-100 text-foreground font-sans text-xs hover:bg-neutral-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center lg:text-left"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4">
            Catálogo de Velas
          </h1>
          <p className="font-sans text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0">
            Descubre velas aromáticas para llenar tus espacios de calidez.
            Elige tu aroma favorito y consulta disponibilidad por WhatsApp.
          </p>
        </motion.div>

        {/* Gallery */}
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
          />

          <div className="flex-1">
            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="font-sans text-sm text-neutral-600">
                {filteredArtworks.length}{' '}
                {filteredArtworks.length === 1 ? 'vela encontrada' : 'velas encontradas'}
              </p>
            </motion.div>

            {/* Grid */}
            {filteredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredArtworks.map((artwork, index) => (
                  <ArtCard key={artwork.id} artwork={artwork} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">
                  No se encontraron velas
                </h3>
                <p className="font-sans text-neutral-600">
                  {artworks.length === 0
                    ? 'Aún no hay velas en el catálogo.'
                    : 'No hay velas que coincidan con los filtros seleccionados.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
