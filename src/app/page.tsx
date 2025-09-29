// Extraído desde (public)/page.tsx para evitar conflicto de múltiples páginas raíz.
import Link from 'next/link';

export default function LandingContent() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <SectionsPreview />
      <CallToAction />
    </main>
  );
}

function Hero() {
  return (
    <section className="pt-24 pb-28 px-6 max-w-6xl mx-auto text-center">
      <div className="inline-block mb-6 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 text-white shadow-sm">
        Próximamente · Custom Nail Experiences
      </div>
      <h1
        data-testid="hero-title"
        className="text-4xl md:text-6xl font-semibold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400"
      >
        Diseños de uñas personalizados & colección ready‑to‑wear
      </h1>
      <p className="mt-6 text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-neutral-600 dark:text-neutral-300">
        Diseña y encarga sets personalizados de uñas o elige modelos listos para llevar.
        La interfaz del sitio adopta una estética inspirada en acabados cromo, metal
        líquido y motivos tribales modernos, pero tus diseños pueden ser del estilo que
        imagines.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/custom"
          className="rounded-full bg-black text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors shadow"
        >
          Empezar encargo
        </Link>
        <Link
          href="/shop"
          className="rounded-full px-8 py-3 text-sm font-medium border border-neutral-300 hover:border-neutral-900 hover:text-black dark:border-neutral-700 dark:hover:border-neutral-300 dark:text-neutral-200 dark:hover:text-white transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}

function SectionsPreview() {
  return (
    <section className="px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 mt-10">
      {[
        {
          title: 'Materiales premium',
          desc: 'Selección de bases y acabados duraderos con brillo y definición superior.',
        },
        {
          title: 'Diseño asistido',
          desc: 'Guía paso a paso para especificar forma, largo, acabados, temática y extras.',
        },
        {
          title: 'Perfiles de medida',
          desc: 'Guarda tus medidas para pedidos futuros sin repetir el proceso.',
        },
      ].map((c) => (
        <div
          key={c.title}
          className="group rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm shadow-sm hover:shadow transition-shadow"
        >
          <h3 className="font-medium mb-2 text-neutral-800 dark:text-neutral-100">
            {c.title}
          </h3>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {c.desc}
          </p>
        </div>
      ))}
    </section>
  );
}

function CallToAction() {
  return (
    <section className="mt-24 mb-40 px-6">
      <div className="max-w-4xl mx-auto rounded-2xl relative overflow-hidden border border-neutral-200 dark:border-neutral-800 p-10 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900/60 dark:to-neutral-950">
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_20%_20%,theme(colors.neutral.400),transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_20%,theme(colors.neutral.600),transparent_60%)]" />
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight relative">
          Listo para un diseño único
        </h2>
        <p className="mt-4 text-sm md:text-base max-w-xl relative text-neutral-600 dark:text-neutral-300">
          Nuestro wizard te ayuda a plasmar la idea y obtener un presupuesto rápido.
        </p>
        <div className="mt-8 relative flex flex-wrap gap-4">
          <Link
            href="/custom"
            className="rounded-full bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
          >
            Iniciar wizard
          </Link>
          <Link
            href="/measure"
            className="rounded-full px-6 py-2.5 text-sm font-medium border border-neutral-300 hover:border-neutral-900 hover:text-black dark:border-neutral-700 dark:hover:border-neutral-300 dark:text-neutral-200 dark:hover:text-white transition-colors"
          >
            Medir ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
