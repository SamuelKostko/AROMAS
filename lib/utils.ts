import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return euroFormatter.format(price);
}
