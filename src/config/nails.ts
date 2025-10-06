/**
 * Nail domain constants: lengths and shapes
 * - Long & Medium: square, almond, ballerina (coffin), stiletto
 * - Short: all except stiletto
 */
export const NAIL_LENGTHS = ['short', 'medium', 'long'] as const;
export type NailLength = (typeof NAIL_LENGTHS)[number];

export const NAIL_SHAPES_ALL = ['square', 'almond', 'ballerina', 'stiletto'] as const;
export type NailShape = (typeof NAIL_SHAPES_ALL)[number];

export const ALLOWED_SHAPES_BY_LENGTH: Record<NailLength, NailShape[]> = {
  short: ['square', 'almond', 'ballerina'],
  medium: ['square', 'almond', 'ballerina', 'stiletto'],
  long: ['square', 'almond', 'ballerina', 'stiletto'],
};

export function isShapeAllowed(length: NailLength, shape: NailShape): boolean {
  return ALLOWED_SHAPES_BY_LENGTH[length].includes(shape);
}
