export default function CustomWizardPlaceholder() {
  return (
    <main className="px-6 pt-24 pb-40 max-w-5xl mx-auto">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Encargo personalizado</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Aquí construiremos un wizard multi‑paso para definir contacto, diseño, imágenes
          de inspiración, medidas y envío de solicitud.
        </p>
      </header>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white/70 dark:bg-neutral-900/40 text-sm leading-relaxed">
        <p>
          Placeholder del flujo. Próximamente: pasos, validación progresiva, subida a
          Storage y resumen final antes de enviar.
        </p>
      </div>
    </main>
  );
}
