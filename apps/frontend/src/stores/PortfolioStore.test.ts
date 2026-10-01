import { describe, expect, it } from 'vitest';
import { portfolioStore } from './PortfolioStore';

describe('PortfolioStore.getPortfolioBySymbol', () => {
  it('matches case-insensitively', () => {
    portfolioStore.portfolios = [
      {
        _id: '1',
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        shares: 10,
        purchasePrice: 150,
      },
    ];
    expect(portfolioStore.getPortfolioBySymbol('aapl')?.companyName).toBe('Apple Inc.');
    expect(portfolioStore.getPortfolioBySymbol('MSFT')).toBeUndefined();
    portfolioStore.portfolios = [];
  });
});
