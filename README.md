# 🎨 HYOSS_ART - Plataforma de Venta de Arte

Plataforma de e-commerce inspirada en Ola Click, optimizada para la venta de arte contemporáneo con enfoque mobile-first y checkout vía WhatsApp.

## 🚀 Características Principales

- **Catálogo Digital Elegante**: Diseño minimalista inspirado en galerías de arte premium
- **Mobile-First**: Interfaz optimizada para dispositivos móviles con navegación intuitiva
- **Checkout Rápido**: Integración directa con WhatsApp para consultas inmediatas
- **Filtros Inteligentes**: Sistema de filtrado por categoría y rango de precio
- **Carrito Persistente**: Estado del carrito guardado localmente con Zustand
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Detalle de Obra**: Vista completa con especificaciones técnicas y descripción

## 📁 Estructura del Proyecto

```
art-gallery/
├── app/
│   ├── layout.tsx              # Layout principal con fuentes y navegación
│   ├── page.tsx                # Página del catálogo principal
│   ├── globals.css             # Estilos globales y Tailwind
│   ├── artwork/[id]/
│   │   └── page.tsx           # Página de detalle de obra
│   └── success/
│       └── page.tsx           # Página de confirmación post-consulta
├── components/
│   ├── Navbar.tsx             # Navegación minimalista con carrito
│   ├── ArtCard.tsx            # Tarjeta de obra optimizada para móvil
│   ├── ArtGallery.tsx         # Componente principal del catálogo
│   ├── FilterSidebar.tsx      # Sidebar de filtros responsive
│   └── CartSidebar.tsx        # Modal lateral del carrito
├── lib/
│   ├── art-data.ts            # Mock de datos de obras de arte
│   ├── cart-store.ts          # Store de Zustand para el carrito
│   ├── checkout-utils.ts      # Utilidades para WhatsApp checkout
│   └── utils.ts               # Utilidades generales (cn)
└── public/
    └── images/                # Imágenes estáticas
```

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** (App Router) - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de utilidades CSS
- **Framer Motion** - Animaciones y transiciones

### Estado y Datos
- **Zustand** - Gestión de estado del carrito
- **Mock Data** - Datos de obras de arte simulados

### UI/UX
- **Lucide React** - Iconos modernos y consistentes
- **Google Fonts** (Playfair Display, Crimson Pro, Inter) - Tipografía elegante

## 🎨 Diseño y Estética

### Paleta de Colores
- **Background**: `#F9F9F9` - Fondo claro minimalista
- **Foreground**: `#1A1A1A` - Texto oscuro de alto contraste
- **Accent Cream**: `#F5F1E8` - Acentos cálidos
- **Accent Gold**: `#D4AF37` - Detalles premium

### Tipografía
- **Display**: Playfair Display (Títulos y encabezados)
- **Sans**: Crimson Pro (Subtítulos)
- **Body**: Inter (Texto de cuerpo)

### Principios de Diseño
- Espacios en blanco generosos
- Enfoque total en las imágenes de las obras
- Jerarquía visual clara
- Interacciones suaves y naturales

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio o usar los archivos generados
cd art-gallery

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

### Comandos Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run start    # Inicia servidor de producción
npm run lint     # Ejecuta el linter
```

## 📱 Funcionalidades Implementadas

### 1. Catálogo de Arte
- Grid responsive (1 columna móvil, 3+ columnas desktop)
- Carga progresiva de imágenes con placeholders
- Hover effects y animaciones de entrada
- Badges de disponibilidad (Disponible, Reservado, Vendido)

### 2. Sistema de Filtros
- Filtro por categoría (Pintura, Abstracto, Paisaje, etc.)
- Filtro por rango de precio
- Sidebar para desktop, modal para móvil
- Contador de resultados en tiempo real

### 3. Carrito de Compras
- Agregar/eliminar obras
- Control de cantidad por obra
- Cálculo automático del total
- Persistencia local con Zustand
- Badge de notificación en el navbar

### 4. WhatsApp Checkout
- Generación automática de mensaje con:
  - Lista de obras seleccionadas
  - Detalles de cada obra (artista, dimensiones, precio)
  - Total de la compra
  - Consulta sobre disponibilidad y envío
- Apertura directa en WhatsApp (web o app)

### 5. Detalle de Obra
- Galería de imagen a gran escala
- Información completa (descripción, técnica, dimensiones)
- Especificaciones técnicas en cards
- Botones de acción (favoritos, compartir, añadir al carrito)
- Indicador de disponibilidad

### 6. Página de Éxito
- Confirmación visual de la consulta
- Próximos pasos detallados
- Enlace directo a WhatsApp
- Navegación de vuelta al catálogo

## 🔧 Configuración

### WhatsApp Business
Para configurar el checkout de WhatsApp, edita `/lib/checkout-utils.ts`:

```typescript
const businessPhone = 'TU_NUMERO_AQUI'; // Formato: código de país + número (ej: 14155551234)
```

### Stripe (Opcional)
Para integrar Stripe como método de pago alternativo:

1. Obtén tus API keys de Stripe
2. Implementa la creación de sesión de checkout en el backend
3. Actualiza la función `generateStripeCheckout` en `/lib/checkout-utils.ts`

### Datos de Arte
Las obras ya no están hardcodeadas en el código fuente. Para agregar, editar o eliminar obras:

- Usa el panel de administración en `/admin` (requiere configurar `ADMIN_PASSWORD`).
- En entornos donde no uses el panel, puedes editar el archivo `data/catalog.json` en el servidor.

## 🎯 Roadmap y Mejoras Futuras

### Funcionalidades Pendientes
- [ ] Autenticación de usuarios
- [ ] Sistema de favoritos persistente
- [ ] Búsqueda por texto
- [ ] Ordenamiento (precio, fecha, popularidad)
- [ ] Galería de imágenes múltiples por obra
- [ ] Sistema de reviews y calificaciones
- [ ] Newsletter y notificaciones
- [ ] Panel de administración
- [ ] Integración con CMS (Sanity/Contentful)
- [ ] Pasarela de pago Stripe completa
- [ ] Sistema de envíos y tracking

### Optimizaciones Técnicas
- [ ] Lazy loading de imágenes con Next/Image
- [ ] Caché de datos con React Query
- [ ] Optimización de bundle size
- [ ] Implementar ISR (Incremental Static Regeneration)
- [ ] Tests unitarios y e2e
- [ ] Análisis de performance con Lighthouse

## 📝 Consideraciones de Producción

### SEO
- Agregar metadatos dinámicos por obra
- Implementar sitemap.xml
- Agregar datos estructurados (JSON-LD)
- Optimizar imágenes (WebP, tamaños múltiples)

### Seguridad
- Validar inputs del lado del servidor
- Implementar rate limiting
- Sanitizar mensajes de WhatsApp
- HTTPS obligatorio

### Analytics
- Google Analytics o Plausible
- Tracking de conversiones
- Heatmaps con Hotjar
- A/B testing de checkout flow

## 🤝 Contribuciones

Este es un proyecto de demostración. Para sugerencias o mejoras:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autor

Creado como demostración de una plataforma moderna de e-commerce para arte.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
