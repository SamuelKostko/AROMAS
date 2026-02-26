# ⚡ Guía de Inicio Rápido - HYOSS_ART

## 🚀 En 5 Minutos

### Paso 1: Verificar Requisitos
```bash
node --version  # Debe ser v18.0 o superior
npm --version   # Debe estar instalado
```

Si no tienes Node.js instalado:
- Descarga desde: https://nodejs.org/

### Paso 2: Instalar Dependencias
```bash
cd art-gallery
npm install
```

⏱️ Esto tomará 2-3 minutos dependiendo de tu conexión.

### Paso 3: Ejecutar en Desarrollo
```bash
npm run dev
```

🎉 **¡Listo!** Abre tu navegador en: http://localhost:3000

## 📱 Probar en Móvil

### Opción 1: DevTools Chrome
1. Abre http://localhost:3000
2. Presiona `F12` o `Cmd+Option+I` (Mac)
3. Click en el ícono de dispositivo móvil (toggle device toolbar)
4. Selecciona un dispositivo (iPhone 12 Pro, Galaxy S21, etc.)

### Opción 2: Tu Teléfono Real
1. Encuentra tu IP local:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. En tu teléfono (misma red WiFi):
   - Abre el navegador
   - Navega a: `http://TU_IP:3000`
   - Ejemplo: `http://192.168.1.100:3000`

## 🎨 Primera Personalización

### Cambiar el Número de WhatsApp
Archivo: `lib/checkout-utils.ts`

```typescript
const businessPhone = '584123580995'; // Formato: 14155551234
```

Ejemplo:
- Para México: `525512345678` (52 = código país)
- Para España: `34912345678` (34 = código país)
- Para USA: `14155551234` (1 = código país)

### Agregar Tus Propias Obras
Archivo: `lib/art-data.ts`

```typescript
{
  id: '013', // ID único
  title: 'Mi Obra Maestra',
  artist: 'Tu Nombre',
  year: 2024,
  price: 5000,
  currency: 'USD',
  dimensions: { width: 100, height: 120, unit: 'cm' },
  medium: 'Óleo sobre lienzo',
  description: 'Descripción de tu obra...',
  image: 'URL_de_tu_imagen',
  category: 'Pintura',
  availability: 'available',
}
```

### Cambiar Colores
Archivo: `tailwind.config.ts`

```typescript
colors: {
  background: "#TU_COLOR_DE_FONDO",
  foreground: "#TU_COLOR_DE_TEXTO",
  // ... más colores
}
```

## 🧪 Probar Funcionalidades

### 1. Agregar al Carrito
1. Navega al catálogo
2. Haz clic en el ícono de bolsa en cualquier obra
3. Observa el contador en el navbar

### 2. Ver Detalles de Obra
1. Haz clic en cualquier obra
2. Verás la página de detalle completa
3. Prueba los botones de favorito y compartir

### 3. Usar Filtros
1. **Desktop**: Usa el sidebar izquierdo
2. **Móvil**: Presiona el botón flotante de filtros
3. Filtra por categoría o precio

### 4. WhatsApp Checkout
1. Agrega varias obras al carrito
2. Abre el carrito
3. Presiona "Consultar por WhatsApp"
4. Verás el mensaje pre-formateado

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Opción 1: Usar otro puerto
PORT=3001 npm run dev

# Opción 2: Matar el proceso en el puerto 3000
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Imágenes no cargan
- Verifica tu conexión a internet
- Las imágenes usan URLs de Unsplash
- En producción, usa tus propias imágenes

### Estilos no se aplican
```bash
# Reconstruir Tailwind
npm run dev
# Presiona Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows) para hard refresh
```

## 📦 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Ejecuta build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint

# Limpieza
rm -rf .next         # Limpia cache de Next.js
```

## 🎯 Siguientes Pasos

### Inmediatos (Hoy)
1. ✅ Ejecutar el proyecto localmente
2. 🎨 Cambiar el número de WhatsApp
3. 📝 Agregar 2-3 obras propias
4. 🎨 Personalizar colores principales

### Corto Plazo (Esta Semana)
1. 🌐 Desplegar en Vercel (gratis)
2. 🔗 Conectar dominio personalizado
3. 📊 Configurar analytics
4. 🖼️ Subir imágenes reales de obras

### Mediano Plazo (Este Mes)
1. 🔐 Implementar autenticación
2. 💳 Integrar Stripe
3. 📧 Configurar newsletter
4. 🎨 Agregar más obras al catálogo

## 💡 Tips de Desarrollo

### Hot Reload
El proyecto tiene hot reload activado. Los cambios en el código se reflejan automáticamente en el navegador sin reiniciar el servidor.

### Modo Producción Local
Para probar cómo se verá en producción:
```bash
npm run build
npm run start
```

### Debugging
- Usa `console.log()` en componentes
- Los logs aparecen en la terminal
- Usa React DevTools en Chrome

### VS Code Extensions Recomendadas
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- PostCSS Language Support
- ESLint

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [Next.js](https://nextjs.org/docs) - Framework principal
- [React](https://react.dev) - Librería UI
- [Tailwind CSS](https://tailwindcss.com/docs) - Estilos
- [Framer Motion](https://www.framer.com/motion/) - Animaciones

### Tutoriales Recomendados
- Next.js 15 Tutorial (YouTube)
- Tailwind CSS Crash Course
- Framer Motion Basics

## ❓ FAQ

**P: ¿Puedo usar esto para mi negocio real?**
R: ¡Sí! Es un proyecto completo listo para producción. Solo personaliza el contenido.

**P: ¿Es gratis desplegarlo?**
R: Sí, Vercel ofrece un plan gratuito generoso para proyectos Next.js.

**P: ¿Necesito saber programar para usarlo?**
R: Para uso básico (cambiar textos, imágenes, colores), no. Para personalización avanzada, conocimientos de React ayudan.

**P: ¿Cómo agrego más páginas?**
R: Crea nuevos archivos en la carpeta `app/`. Next.js usa file-based routing.

**P: ¿Funciona sin internet?**
R: Las imágenes de Unsplash requieren internet. Usa imágenes locales para funcionar offline.

## 🆘 Ayuda

### ¿Algo no funciona?
1. Lee los mensajes de error en la terminal
2. Verifica que las dependencias estén instaladas
3. Revisa la sección de solución de problemas
4. Consulta la documentación en README.md

### Quiero Agregar una Función
1. Revisa PROJECT_SUMMARY.md para entender la estructura
2. Consulta el Roadmap en README.md
3. Busca ejemplos en la documentación oficial

---

## 🎉 ¡Felicidades!

Ya tienes una plataforma de e-commerce de arte completamente funcional. 

**Próximo paso:** Abre http://localhost:3000 y explora tu nueva galería de arte. 🎨

¿Preguntas? Revisa README.md o DEPLOYMENT.md para más información.
