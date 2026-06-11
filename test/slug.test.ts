import { toSlug, uniqueSlug } from '@/lib/slug';

describe('toSlug', () => {
  it('converts a simple name to lowercase with hyphens', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(toSlug('Hello! World?')).toBe('hello-world');
  });

  it('handles multiple spaces and dashes', () => {
    expect(toSlug('Hello   World---Test')).toBe('hello-world-test');
  });

  it('trims leading and trailing hyphens', () => {
    expect(toSlug('--Hello World--')).toBe('hello-world');
  });

  it('handles single word', () => {
    expect(toSlug('Hello')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(toSlug('')).toBe('');
  });

  it('handles only special characters', () => {
    expect(toSlug('!!! ???')).toBe('');
  });
});

describe('uniqueSlug', () => {
  it('returns base slug when no conflict', () => {
    const existing = new Set(['hello-world']);
    expect(uniqueSlug('test', existing)).toBe('test');
  });

  it('appends -2 when base slug conflicts', () => {
    const existing = new Set(['test']);
    expect(uniqueSlug('test', existing)).toBe('test-2');
  });

  it('increments suffix until unique', () => {
    const existing = new Set(['test', 'test-2', 'test-3']);
    expect(uniqueSlug('test', existing)).toBe('test-4');
  });

  it('handles empty existing set', () => {
    const existing = new Set<string>();
    expect(uniqueSlug('hello', existing)).toBe('hello');
  });

  it('handles multiple existing slugs with same prefix', () => {
    const existing = new Set(['post', 'post-2', 'article']);
    expect(uniqueSlug('post', existing)).toBe('post-3');
  });
});
