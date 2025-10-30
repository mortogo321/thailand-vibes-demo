import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

@Injectable()
export class StocksService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('FMP_API_KEY');
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const url = `${this.baseUrl}/quote/${symbol.toUpperCase()}?apikey=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));

      if (!response.data || response.data.length === 0) {
        throw new HttpException(
          `Stock symbol ${symbol} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch stock quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchStocks(query: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/search?query=${query}&limit=10&apikey=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data || [];
    } catch (error) {
      throw new HttpException(
        'Failed to search stocks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
