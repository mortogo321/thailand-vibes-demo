import { describe, expect, it } from 'vitest';
import api, { portfolioApi, stocksApi } from './api';

describe('api client', () => {
  it('has a JSON content-type and timeout', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
    expect(api.defaults.timeout).toBe(10_000);
  });

  it('exposes portfolio and stocks helpers', () => {
    expect(typeof portfolioApi.getAll).toBe('function');
    expect(typeof portfolioApi.create).toBe('function');
    expect(typeof portfolioApi.update).toBe('function');
    expect(typeof portfolioApi.delete).toBe('function');
    expect(typeof stocksApi.getQuote).toBe('function');
    expect(typeof stocksApi.search).toBe('function');
  });
});
