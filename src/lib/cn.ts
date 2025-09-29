// Pequeña utilidad para concatenar clases condicionales.
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}
