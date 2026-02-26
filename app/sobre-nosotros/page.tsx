import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'HYOSS_ART - Sobre Nosotros',
  description:
    'Conoce HYOSS_ART: una galería digital con una selección curada de arte contemporáneo.',
};

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-neutral-100 text-foreground text-sm font-sans tracking-wide rounded">
            HYOSS_ART
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl text-foreground text-balance">
            Sobre Nosotros
          </h1>
          <p className="mt-4 font-sans text-base sm:text-lg text-neutral-700 leading-relaxed">
            ¡Dale vida y color a tus espacios con arte en madera! </p><br></br> <p> 🎨🪵
            Soy Yosmar Hernández y me dedico a transformar piezas de madera en objetos decorativos únicos, pintados totalmente a mano. Cada pieza está creada con dedicación y detalle, pensada para llenar de calidez y estilo cada rincón de tu hogar o lugar de trabajo.
            Ya sea que busques un toque rústico, moderno o personalizado, mis diseños son el complemento ideal para quienes valoran el arte hecho con amor.
            </p><br></br> <p>✨ Explora mi colección y encuentra la pieza perfecta para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 bg-neutral-50 rounded-sm border border-neutral-200">
            <h2 className="font-display text-xl text-foreground mb-2">Nuestra misión</h2>
            <p className="font-sans text-neutral-700 leading-relaxed">
              Acercar obras auténticas a coleccionistas y amantes del arte, haciendo que el
              proceso de descubrir y consultar sea simple y directo.
            </p>
          </section>


          <section className="p-6 bg-neutral-50 rounded-sm border border-neutral-200 md:col-span-2">
            <h2 className="font-display text-xl text-foreground mb-2">Cómo funciona</h2>
            <ol className="mt-3 space-y-2 font-sans text-neutral-700">
              <li>1. Explora el catálogo y abre el detalle de cada obra.</li>
              <li>2. Añade al carrito para armar tu selección.</li>
              <li>3. Envía tu consulta para coordinar disponibilidad y entrega.</li>
            </ol>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-foreground text-background font-sans text-sm"
              >
                Volver al catálogo
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
