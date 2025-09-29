export default function DashboardPage() {
  return (
    <main className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Panel privado</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Aquí irán estadísticas, pedidos recientes y accesos rápidos.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Pedidos', desc: 'Resumen y estados' },
          { title: 'Perfiles de medidas', desc: 'Acceso rápido' },
          { title: 'Borradores', desc: 'Diseños en preparación' },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-sm"
          >
            <h3 className="text-sm font-medium mb-1">{c.title}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{c.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
