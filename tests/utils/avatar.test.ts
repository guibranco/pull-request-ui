import { describe, it, expect } from 'vitest';
import { getAppAvatarUrl } from '../../src/utils/avatar';

describe('getAppAvatarUrl', () => {
  it('builds the avatar URL from a numeric app id', () => {
    expect(getAppAvatarUrl(123)).toBe(
      'https://avatars.githubusercontent.com/in/123?v=4'
    );
  });

  it('builds the avatar URL from a string app id', () => {
    expect(getAppAvatarUrl('abc')).toBe(
      'https://avatars.githubusercontent.com/in/abc?v=4'
    );
  });
});
