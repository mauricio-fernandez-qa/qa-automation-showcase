/** Turns a displayed price ("$14.15", "14.15") into a number. */
export function parsePrice(text: string): number {
  const value = Number(text.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) throw new Error(`Not a price: "${text}"`);
  return value;
}

const CENTS = 100;

/** Money comparison without floating point noise. */
export function toCents(amount: number): number {
  return Math.round(amount * CENTS);
}
