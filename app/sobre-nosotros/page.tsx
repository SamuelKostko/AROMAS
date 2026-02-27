import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.brandName} - Sobre Nosotros`,
  description:
    `Conoce ${SITE.brandName}: velas aromáticas artesanales para llenar tus espacios de calidez.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-neutral-100 text-foreground text-sm font-sans tracking-wide rounded">
            {SITE.brandName}
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl text-foreground text-balance">
            Sobre Nosotros
          </h1>
          <p className="mt-4 font-sans text-base sm:text-lg text-neutral-700 leading-relaxed">
            Somos {SITE.brandName}, un emprendimiento de velas aromáticas artesanales.
            Creamos aromas pensados para acompañarte: para regalar, para relajarte o para
            darle un toque especial a tu hogar.
          </p>
          <p className="mt-4 font-sans text-base sm:text-lg text-neutral-700 leading-relaxed">
            (Hola! mi nombre es Katherine, fundadora de esta hermosa marca. Cada vez que eliges nuestros productos, nos das un impulso gigante para perseguir nuestros sueños emprendedores.
 Tu apoyo significa el mundo y nos motiva a seguir mejorando cada día. ¡Gracias por ser parte de nuestra aventura!)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 bg-neutral-50 rounded-sm border border-neutral-200">
            <h2 className="font-display text-xl text-foreground mb-2">Nuestra misión</h2>
            <p className="font-sans text-neutral-700 leading-relaxed">
              Elaborar velas de calidad con aromas memorables, haciendo que el proceso de
              descubrir, elegir y consultar sea simple y directo.
            </p>
          </section>


          <section className="p-6 bg-neutral-50 rounded-sm border border-neutral-200 md:col-span-2">
            <h2 className="font-display text-xl text-foreground mb-2">Cómo funciona</h2>
            <ol className="mt-3 space-y-2 font-sans text-neutral-700">
              <li>1. Explora el catálogo y abre el detalle de cada vela.</li>
              <li>2. Añade al carrito para armar tu selección.</li>
              <li>3. Envía tu consulta por WhatsApp para coordinar disponibilidad y entrega.</li>
            </ol>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-foreground text-background font-sans text-sm"
              >
                Ver catálogo
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
