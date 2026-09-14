export function getReconnectDelay(
  attempt: number,
  maxDelay: number
) {
  return Math.min(
    1000 * 2 ** attempt,
    maxDelay
  );
}