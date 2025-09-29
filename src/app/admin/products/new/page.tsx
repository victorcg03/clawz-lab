'use client';

import { Button } from '@/components/layout/ui/Button';
import { Input } from '@/components/layout/ui/Input';
import { Textarea } from '@/components/layout/ui/Textarea';
import { Select } from '@/components/layout/ui/Select';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Nuevo producto
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Añade un nuevo producto al catálogo
          </p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline">Volver a productos</Button>
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name_es" className="block text-sm font-medium mb-2">
                Nombre (Español) *
              </label>
              <Input id="name_es" placeholder="Uñas Elegantes Doradas" required />
            </div>

            <div>
              <label htmlFor="name_en" className="block text-sm font-medium mb-2">
                Nombre (Inglés) *
              </label>
              <Input id="name_en" placeholder="Elegant Golden Nails" required />
            </div>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              URL Slug *
            </label>
            <Input id="slug" placeholder="unas-elegantes-doradas" required />
            <p className="text-xs text-neutral-500 mt-1">
              Se usará para crear la URL del producto: /product/unas-elegantes-doradas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="base_price" className="block text-sm font-medium mb-2">
                Precio base (€) *
              </label>
              <Input
                id="base_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="25.00"
                required
              />
            </div>

            <div>
              <label htmlFor="collection" className="block text-sm font-medium mb-2">
                Colección
              </label>
              <Select id="collection">
                <option value="">Sin colección</option>
                <option value="elegante">Elegante</option>
                <option value="casual">Casual</option>
                <option value="party">Fiesta</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="description_es" className="block text-sm font-medium mb-2">
                Descripción (Español)
              </label>
              <Textarea
                id="description_es"
                rows={4}
                placeholder="Descripción detallada del producto en español..."
              />
            </div>

            <div>
              <label htmlFor="description_en" className="block text-sm font-medium mb-2">
                Descripción (Inglés)
              </label>
              <Textarea
                id="description_en"
                rows={4}
                placeholder="Detailed product description in English..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="active"
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600"
              defaultChecked
            />
            <label htmlFor="active" className="text-sm font-medium">
              Producto activo (visible en la tienda)
            </label>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              🚧 Funcionalidad en desarrollo
            </h3>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Esta es una página placeholder. En una implementación completa incluiría:
              gestión de variantes, subida de imágenes, SEO metadata, y más campos de
              configuración.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <Link href="/admin/products">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button variant="primary" disabled>
              Crear producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
