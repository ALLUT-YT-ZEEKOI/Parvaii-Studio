/** Basic boutique drop categories for selection */
export const DROP_CATEGORIES = [
  'Dresses',
  'Tops',
  'Kurtis',
  'Co-ords',
  'Accessories',
  'Limited Edition',
  'Mixed Capsule',
  'Apparel',
] as const;

export type DropCategory = (typeof DROP_CATEGORIES)[number];
