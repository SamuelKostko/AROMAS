export const SITE = {
  brandName: 'AROMAS DEL CORAZÓN',
  brandTagline: 'Velas aromáticas hechas con amor',
  description:
    'Velas aromáticas artesanales para llenar tus espacios de calidez y bienestar. Explora el catálogo y consulta disponibilidad por WhatsApp.',
  keywords: ['velas', 'velas aromáticas', 'aromas', 'regalos', 'artesanal'],
  whatsappPhone: '584126303765',
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappPhone}`;
  },
};
