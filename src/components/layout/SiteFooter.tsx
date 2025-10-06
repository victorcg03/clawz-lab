export function SiteFooter() {
  return (
    <footer className="relative">
      <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p className="relative inline-block">
          © {new Date().getFullYear()} Clawz Lab · Todos los derechos reservados.
          {/* Pequeño acento tribal */}
          <span className="absolute -top-2 -right-3 w-1 h-1 bg-current rounded-full opacity-40" />
        </p>
      </div>
    </footer>
  );
}
