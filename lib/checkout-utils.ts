import { CartItem } from './cart-store';
import { SITE } from './site';
import { formatPrice } from './utils';

export function generateWhatsAppMessage(items: CartItem[], totalPrice: number): string {
  const businessPhone = SITE.whatsappPhone;
  
  let message = '🕯️ *Consulta de Velas*\n\n';
  message += `Hola! Me interesan las siguientes velas en ${SITE.brandName}:\n\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.title}*\n`;
    message += `   Precio: ${formatPrice(item.price)}\n`;
    if (item.quantity > 1) {
      message += `   Cantidad: ${item.quantity}\n`;
    }
    message += '\n';
  });
  
  message += `*Total: ${formatPrice(totalPrice)}*\n\n`;
  message += '¿Podrían darme más información sobre disponibilidad y envío?';
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessPhone}?text=${encodedMessage}`;
}

export function generateStripeCheckout(items: CartItem[]): string {
  // Esta es una URL de ejemplo - en producción se conectaría con Stripe API
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.title,
        description: item.description,
        images: [item.image],
      },
      unit_amount: item.price * 100, // Stripe usa centavos
    },
    quantity: item.quantity,
  }));
  
  // En producción, esto sería una llamada al backend para crear una sesión de checkout
  console.log('Stripe line items:', lineItems);
  return '#'; // Placeholder
}
