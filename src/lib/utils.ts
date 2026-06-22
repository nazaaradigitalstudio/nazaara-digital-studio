export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
