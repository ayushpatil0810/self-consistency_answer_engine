export async function measureLatency<T>(
  fn: () => Promise<T>
): Promise<{ result: T; latency: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  return { result, latency: Math.round(end - start) };
}
