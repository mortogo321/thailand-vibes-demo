export interface Portfolio {
  _id: string;
  symbol: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  purchaseDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface CreatePortfolioDto {
  symbol: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  purchaseDate?: string;
  notes?: string;
}

export interface UpdatePortfolioDto {
  symbol?: string;
  companyName?: string;
  shares?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
}
