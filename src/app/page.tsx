// Extraído desde (public)/page.tsx para evitar conflicto de múltiples páginas raíz.
import Link from 'next/link';
// Button component no usado directamente aquí; usamos estilos de tokens en enlaces.
import { cn } from '@/lib/cn';
import React from 'react';
import { VisualEffects, MetallicHover } from '@/components/effects/VisualEffects';

export default function LandingContent() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      <VisualEffects variant="hero">
        <Hero />
      </VisualEffects>
      <VisualEffects variant="section">
        <SectionsPreview />
      </VisualEffects>
      <VisualEffects variant="section">
        <CallToAction />
      </VisualEffects>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-28 px-6 max-w-6xl mx-auto text-center">
      {/* Fondo con gradiente tribal sutil */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-radial from-neutral-200/50 to-transparent blur-2xl animate-pulse" />
        <div
          className="absolute top-40 right-1/3 w-24 h-24 bg-gradient-radial from-neutral-300/40 to-transparent blur-xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="glass-card inline-block mb-6 px-4 py-2 text-[11px] font-medium tracking-wide text-neutral-800 dark:text-neutral-200 backdrop-blur-sm">
        Próximamente · Custom Nail Experiences
      </div>

      <h1
        data-testid="hero-title"
        className="text-4xl md:text-6xl font-semibold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-50 dark:via-neutral-200 dark:to-neutral-400"
      >
        Diseños de uñas personalizados & colección ready‑to‑wear
      </h1>

      <p className="mt-6 text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-neutral-600 dark:text-neutral-300">
        Diseña y encarga sets personalizados de uñas o elige modelos listos para llevar.
        Un proceso simple, claro y rápido para que pases de la idea al pedido sin
        fricción.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4 py-4">
        <MetallicHover>
          <ButtonLink href="/custom" variant="primary" size="lg">
            Empezar encargo
          </ButtonLink>
        </MetallicHover>
        <MetallicHover>
          <ButtonLink href="/shop" variant="outline" size="lg">
            Ver catálogo
          </ButtonLink>
        </MetallicHover>
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
      ].map((c, index) => (
        <div
          key={c.title}
          className="glass-card hover-enabled group p-6 relative overflow-hidden"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Línea divisoria metálica */}
          <div className="divider-metal absolute top-0 left-6 right-6" />

          {/* Efecto shimmer sutil en hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
            <div className="shimmer w-full h-full" />
          </div>

          <h3 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-50 relative z-10 text-lg">
            {c.title}
          </h3>
          <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-100 relative z-10 font-medium">
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
      <div className="max-w-4xl mx-auto glass-card relative overflow-hidden p-10 group">
        {/* Patrones tribales sutiles */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <div className="absolute top-8 right-8 w-16 h-16 border border-current rounded-full opacity-30" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border border-current rounded-full opacity-20" />
          <div className="absolute top-1/2 left-1/3 w-8 h-8 border border-current transform rotate-45 opacity-25" />
        </div>

        {/* Gradiente de fondo tribal */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[radial-gradient(circle_at_30%_40%,theme(colors.neutral.400),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_40%,theme(colors.neutral.600),transparent_70%)]" />

        {/* Divisor metálico superior */}
        <div className="divider-metal absolute top-0 left-10 right-10" />

        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight relative bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
          Listo para un diseño único
        </h2>

        <p className="mt-4 text-sm md:text-base max-w-xl relative text-neutral-800 dark:text-neutral-200 font-medium">
          Nuestro wizard te ayuda a plasmar la idea y obtener un presupuesto rápido.
        </p>

        <div className="mt-8 relative flex flex-wrap gap-4 px-4 py-4">
          <MetallicHover>
            <ButtonLink href="/custom" variant="primary">
              Iniciar wizard
            </ButtonLink>
          </MetallicHover>
          <MetallicHover>
            <ButtonLink href="/measure" variant="outline">
              Medir ahora
            </ButtonLink>
          </MetallicHover>
        </div>
      </div>
    </section>
  );
}

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: import('@/components/layout/ui/Button').ButtonProps['variant'];
  size?: import('@/components/layout/ui/Button').ButtonProps['size'];
  className?: string;
}

function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
}: Readonly<ButtonLinkProps>) {
  const base = 'btn-base btn-with-margin font-medium focus-ring';
  const variants: Record<string, string> = {
    primary: 'btn-primary btn-shadow-sm',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    subtle: 'btn-subtle',
  };
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-sm',
  };
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
