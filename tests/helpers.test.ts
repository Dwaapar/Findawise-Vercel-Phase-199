import { describe, it, expect, vi } from 'vitest';
import {
  generateId,
  generateUUID,
  sleep,
  sanitizeString,
  formatError,
  safeJsonParse,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  toCamelCase,
  toSnakeCase
} from '../server/utils/helpers';

describe('helper utilities', () => {
  it('generateId produces hex string of correct length', () => {
    const id = generateId(8);
    expect(id).toMatch(/^[0-9a-f]+$/);
    expect(id).toHaveLength(16);
  });

  it('generateUUID returns v4 uuid', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('sleep resolves after delay', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const promise = sleep(100).then(fn);
    vi.advanceTimersByTime(100);
    await promise;
    expect(fn).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('sanitizeString removes dangerous characters', () => {
    expect(sanitizeString('<script>')).toBe('script');
    expect(sanitizeString('  hello ')).toBe('hello');
  });

  it('formatError formats errors and strings', () => {
    expect(formatError(new Error('oops'))).toBe('Error: oops');
    expect(formatError('plain')).toBe('plain');
  });

  it('safeJsonParse returns fallback on invalid JSON', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
    expect(safeJsonParse('invalid', { b: 2 })).toEqual({ b: 2 });
  });

  it('debounce delays execution', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced();
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('throttle limits execution frequency', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    vi.advanceTimersByTime(50);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(50);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('deepClone creates deep copy', () => {
    const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.b).not.toBe(obj.b);
    expect(clone.d).not.toBe(obj.d);
  });

  it('isEmpty checks emptiness', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty([1])).toBe(false);
  });

  it('converts between camel and snake case', () => {
    expect(toCamelCase('hello_world')).toBe('helloWorld');
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
  });
});
