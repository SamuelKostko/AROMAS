# 🚀 Guía de Despliegue - ARTEA

Esta guía cubre el proceso de despliegue de la plataforma ARTEA en diferentes entornos.

## 📋 Pre-requisitos

- Node.js 18.0 o superior
- npm o yarn
- Cuenta en Vercel (recomendado) o alternativa de hosting

## 🌐 Despliegue en Vercel (Recomendado)

Vercel es la plataforma oficial para Next.js y ofrece el mejor rendimiento y experiencia de desarrollo.

### Método 1: Deploy desde Git (Recomendado)

1. **Prepara tu repositorio Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [TU_REPO_URL]
   git push -u origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub/GitLab/Bitbucket
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configura Variables de Entorno** (Opcional)
   - En Vercel Dashboard > Settings > Environment Variables
   - Agrega las siguientes si es necesario:
     ```
     NEXT_PUBLIC_WHATSAPP_NUMBER=tu_numero_aqui
     NEXT_PUBLIC_STRIPE_PUBLIC_KEY=tu_key_aqui (si usas Stripe)
     ```

4. **Deploy**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará automáticamente
   - Cada push a main generará un nuevo deploy automático

### Método 2: Deploy desde CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (primera vez)
vercel

# Deploy a producción
vercel --prod
```

## 🐳 Despliegue con Docker

### Crear Dockerfile

Crea un archivo `Dockerfile` en la raíz:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Construir y ejecutar

```bash
# Construir imagen
docker build -t art-gallery .

# Ejecutar contenedor
docker run -p 3000:3000 art-gallery
```

## ☁️ Otros Proveedores

### Netlify

1. Instala el plugin de Next.js:
   ```bash
   npm install -D @netlify/plugin-nextjs
   ```

2. Crea `netlify.toml`:
   ```toml
   [build]
   command = "npm run build"
   publish = ".next"

   [[plugins]]
   package = "@netlify/plugin-nextjs"
   ```

3. Conecta tu repositorio en Netlify Dashboard

### Railway

1. Ve a [railway.app](https://railway.app)
2. Crea nuevo proyecto desde GitHub
3. Railway detectará Next.js automáticamente
4. Deploy se ejecutará automáticamente

### DigitalOcean App Platform

1. Crea nueva app en DigitalOcean
2. Conecta repositorio
3. Configura:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 3000

## 🔧 Configuración Post-Deploy

### 1. Dominio Personalizado

**En Vercel:**
- Settings > Domains
- Agrega tu dominio
- Configura DNS según instrucciones

**DNS Records necesarios:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 2. Variables de Entorno

Configura en tu plataforma de hosting:

```env
# WhatsApp Business
NEXT_PUBLIC_WHATSAPP_NUMBER=14155551234

# Stripe (si se implementa)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Configuración de Caché

**En Vercel** (next.config.js):
```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

## 📊 Monitoreo y Analytics

### Google Analytics

1. Obtén tu ID de medición (G-XXXXXXXXXX)

2. Crea `app/GoogleAnalytics.tsx`:
```tsx
'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  );
}
```

3. Importa en `app/layout.tsx`

### Vercel Analytics

```bash
npm i @vercel/analytics
```

En `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🔒 Seguridad

### Headers de Seguridad

En `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### Rate Limiting (Recomendado para producción)

Implementa rate limiting para proteger endpoints:

```bash
npm install express-rate-limit
```

## 📈 Optimización de Rendimiento

### 1. Analizar el Bundle

```bash
npm install -D @next/bundle-analyzer
```

En `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... tu configuración
});
```

Ejecutar análisis:
```bash
ANALYZE=true npm run build
```

### 2. Optimización de Imágenes

Usa `next/image` para todas las imágenes:
```tsx
import Image from 'next/image';

<Image
  src="/artwork.jpg"
  alt="Artwork"
  width={800}
  height={600}
  quality={90}
  priority={index < 6} // Para imágenes above-the-fold
/>
```

### 3. Lazy Loading de Componentes

```tsx
import dynamic from 'next/dynamic';

const CartSidebar = dynamic(() => import('@/components/CartSidebar'), {
  ssr: false,
});
```

## 🐛 Debugging en Producción

### Logs en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Pestaña "Logs"
3. Filtra por función o tiempo

### Error Tracking

Implementa Sentry:

```bash
npm install @sentry/nextjs
```

```bash
npx @sentry/wizard@latest -i nextjs
```

## 📝 Checklist Pre-Deploy

- [ ] Todas las variables de entorno están configuradas
- [ ] Las imágenes están optimizadas
- [ ] Los datos de WhatsApp/Stripe están actualizados
- [ ] El SEO metadata está completo
- [ ] Los tests pasan exitosamente
- [ ] El build local funciona sin errores
- [ ] Los enlaces de navegación funcionan correctamente
- [ ] El carrito persiste correctamente
- [ ] El checkout de WhatsApp abre correctamente
- [ ] La versión móvil se ve bien en diferentes dispositivos
- [ ] Los analytics están configurados
- [ ] Las políticas de privacidad y términos están actualizadas

## 🔄 CI/CD Pipeline (GitHub Actions)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test # Si tienes tests
```

## 📞 Soporte

Para problemas con el despliegue:
- Vercel: https://vercel.com/support
- Next.js: https://nextjs.org/docs
- GitHub Discussions del proyecto

---

¡Tu plataforma ARTEA está lista para producción! 🎉
