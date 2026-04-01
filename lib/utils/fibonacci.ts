const FIBONACCI = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export function nearestFibonacci(avg: number): string {
  let closest: number[] = [FIBONACCI[0]];
  let minDiff = Math.abs(avg - FIBONACCI[0]);

  for (const fib of FIBONACCI) {
    const diff = Math.abs(avg - fib);
    if (diff < minDiff) {
      minDiff = diff;
      closest = [fib];
    } else if (diff === minDiff && !closest.includes(fib)) {
      closest.push(fib);
    }
  }

  return closest.join(' or ');
}
