export function stateColorClass(state: 'OPEN' | 'CLOSED' | 'MERGED'): string {
  if (state === 'OPEN') return 'text-green-400';
  if (state === 'MERGED') return 'text-purple-400';
  return 'text-red-400';
}
