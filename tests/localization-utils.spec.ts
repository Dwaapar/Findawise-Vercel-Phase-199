import { describe, it, expect } from 'vitest';
import {
  interpolateTranslation,
  getPluralForm,
  formatCurrency,
  formatNumber,
} from '../shared/localization';

describe('Localization utilities', () => {
  it('interpolates variables into strings', () => {
    const result = interpolateTranslation('Hello {name}', { name: 'Bob' });
    expect(result).toBe('Hello Bob');
  });

  it('resolves plural forms for English', () => {
    const singular = getPluralForm(1, 'en', { one: 'item', other: 'items' });
    const plural = getPluralForm(2, 'en', { one: 'item', other: 'items' });
    expect(singular).toBe('item');
    expect(plural).toBe('items');
  });

  it('formats currency with locale', () => {
    const formatted = formatCurrency(10, 'en-US', 'USD');
    expect(formatted).toContain('$');
    expect(formatted).toContain('10');
  });

  it('formats numbers with locale', () => {
    const formatted = formatNumber(1000, 'en-US');
    expect(formatted).toBe('1,000');
  });
});
