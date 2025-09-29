export function SiteFooter() {
  return (
    <footer className="mt-20 relative">
      {/* Divisor metálico superior */}
      <div className="divider-metal mb-10" />

      <div className="py-10 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p className="relative inline-block">
          © {new Date().getFullYear()} Clawz Lab · Todos los derechos reservados.
          {/* Pequeño acento tribal */}
          <span className="absolute -top-2 -right-3 w-1 h-1 bg-current rounded-full opacity-40" />
        </p>
      </div>
    </footer>
  );
}
