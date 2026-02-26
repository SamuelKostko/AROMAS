export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  price: number;
  currency: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  medium: string;
  description: string;
  image: string;
  category: string;
  availability: 'available' | 'reserved' | 'sold';
  edition?: string;
}

export const categories = [
  'Todos',
  'Pintura',
  'Abstracto',
  'Paisaje',
  'Retrato',
  'Técnica Mixta',
  'Botánico',
];

export const priceRanges = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Menos de $3,000', min: 0, max: 3000 },
  { label: '$3,000 - $5,000', min: 3000, max: 5000 },
  { label: 'Más de $5,000', min: 5000, max: Infinity },
];
