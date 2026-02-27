export interface Artwork {
  id: string;
  description: string;
  image: string;
  title: string;
  price: number;
  category: string;
}

export type PriceRange = {
  label: string;
  min: number;
  max: number;
  minExclusive?: boolean;
  maxInclusive?: boolean;
};

export const categories = [
  'Todos',
  'Velas aromáticas',
  'Velas de molde',
  'Velas corporales',
  'Velas tipo Ramos',
];

export const priceRanges = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: '$0 - $5', min: 0, max: 5, maxInclusive: true },
  { label: '$5 - $15', min: 5, max: 15, minExclusive: true, maxInclusive: true },
  { label: 'Más de $15', min: 15, max: Infinity, minExclusive: true },
] satisfies PriceRange[];
