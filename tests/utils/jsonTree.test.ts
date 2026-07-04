import { describe, it, expect } from 'vitest';
import { collectJsonPaths } from '../../src/utils/jsonTree';

describe('collectJsonPaths', () => {
  it('collects the root path for an empty object', () => {
    expect(collectJsonPaths({})).toEqual(new Set(['']));
  });

  it('collects nested paths only for object-valued keys', () => {
    const result = collectJsonPaths({
      a: { b: 1 },
      c: 2,
    });

    expect(result).toEqual(new Set(['', 'a']));
  });

  it('does not descend into non-object leaf values', () => {
    const result = collectJsonPaths({ a: 1, b: 'text', c: null });

    expect(result).toEqual(new Set(['']));
  });

  it('collects paths for arrays of objects, including index paths', () => {
    const result = collectJsonPaths({ items: [{ id: 1 }] });

    expect(result).toEqual(new Set(['', 'items', 'items.0']));
  });
});
