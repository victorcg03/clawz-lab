import { Button } from '@/components/layout/ui/Button';
interface Props {
  params: { slug: string };
}

export default function ProductPage({ params }: Readonly<Props>) {
  return (
    <main className="px-6 pt-24 pb-40 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900" />
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Producto: {params.slug}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Descripción del producto y variantes. Aquí iremos añadiendo selector de forma,
            largo, acabado, galería y lógica de medidas obligatoria.
          </p>
          <Button className="rounded-full px-6" variant="primary">
            Añadir al carrito
          </Button>
        </div>
      </div>
    </main>
  );
}
