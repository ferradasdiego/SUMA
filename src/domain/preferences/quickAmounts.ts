export const DEFAULT_QUICK_AMOUNTS_MINOR = [150, 250, 500, 1000] as const;

export const MIN_QUICK_AMOUNTS = 1;
export const MAX_QUICK_AMOUNTS = 6;

export function resolveQuickAmounts(
  values: readonly number[] | null | undefined,
): readonly number[] {
  return values && values.length > 0 ? values : DEFAULT_QUICK_AMOUNTS_MINOR;
}
