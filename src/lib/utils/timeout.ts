export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage = "Request timed out"
): Promise<T> {
  let timer: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}
