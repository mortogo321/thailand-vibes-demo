import { BadRequestException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { StocksService } from './stocks.service';

function makeService(opts: { apiKey?: string; getMock?: Mock } = {}) {
  const getMock = opts.getMock ?? vi.fn().mockReturnValue(of({ data: [] }));
  const httpService = { get: getMock } as unknown as import('@nestjs/axios').HttpService;
  const configService = {
    get: vi.fn().mockReturnValue(opts.apiKey),
  } as unknown as import('@nestjs/config').ConfigService;
  const service = new StocksService(httpService, configService);
  return { service, getMock };
}

describe('StocksService', () => {
  it('rejects invalid symbols without calling upstream', async () => {
    const { service, getMock } = makeService({ apiKey: 'k' });
    await expect(service.getQuote('!!!')).rejects.toBeInstanceOf(BadRequestException);
    expect(getMock).not.toHaveBeenCalled();
  });

  it('throws 503 when provider key missing', async () => {
    const { service } = makeService({ apiKey: undefined });
    await expect(service.getQuote('AAPL')).rejects.toMatchObject({
      status: 503,
    });
  });

  it('returns quote on success', async () => {
    const quote = { symbol: 'AAPL', price: 1 };
    const { service } = makeService({
      apiKey: 'k',
      getMock: vi.fn().mockReturnValue(of({ data: [quote] })),
    });
    await expect(service.getQuote('aapl')).resolves.toEqual(quote);
  });

  it('maps empty upstream to 404', async () => {
    const { service } = makeService({ apiKey: 'k' });
    await expect(service.getQuote('AAPL')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('sanitizes upstream failures to 502', async () => {
    const { service } = makeService({
      apiKey: 'k',
      getMock: vi.fn().mockReturnValue(throwError(() => new Error('upstream down'))),
    });
    await expect(service.getQuote('AAPL')).rejects.toMatchObject({
      status: 502,
    });
  });

  it('rejects invalid search queries', async () => {
    const { service, getMock } = makeService({ apiKey: 'k' });
    await expect(service.searchStocks('')).rejects.toBeInstanceOf(BadRequestException);
    expect(getMock).not.toHaveBeenCalled();
  });
});
