const PLACEHOLDER_PRODUCTS: { id: string; label: string }[] = Array.from({
  length: 8,
}).map((_, i) => ({ id: `placeholder-${i + 1}`, label: `Producto ${i + 1}` }));

export default function ShopPage() {
  return (
    <main className="px-6 pt-24 pb-32 max-w-6xl mx-auto">
      <header className="mb-12 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Explora colecciones y estilos. Esta vista mostrará filtros (forma, largo,
          acabado, precio) y un grid de productos.
        </p>
      </header>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {PLACEHOLDER_PRODUCTS.map((p) => (
          <div
            key={p.id}
            className="aspect-[3/4] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-3 flex flex-col justify-between"
          >
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
              Placeholder
            </div>
            <div className="text-xs font-medium">{p.label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
