// biome-ignore lint/style/useImportType: NestJS constructor DI needs a value import
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS constructor DI needs a value import
import { ConfigService } from '@nestjs/config';
import type { AxiosResponse } from 'axios';
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

export interface StockSearchResult {
  symbol: string;
  name: string;
  [key: string]: unknown;
}

const SYMBOL_RE = /^[A-Za-z.:-]{1,10}$/;
const QUERY_RE = /^[A-Za-z0-9 .:-]{1,50}$/;

@Injectable()
export class StocksService {
  private readonly apiKey: string | undefined;
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('FMP_API_KEY');
  }

  private getApiKey(): string {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('Market data provider is not configured');
    }
    return this.apiKey;
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    const normalized = symbol.trim().toUpperCase();
    if (!SYMBOL_RE.test(normalized)) {
      throw new BadRequestException('Invalid stock symbol');
    }
    const apiKey = this.getApiKey();

    try {
      const url = `${this.baseUrl}/quote/${encodeURIComponent(normalized)}?apikey=${encodeURIComponent(apiKey)}`;
      const response: AxiosResponse<StockQuote[]> = await firstValueFrom(
        this.httpService.get<StockQuote[]>(url, { timeout: 10_000 }),
      );

      if (!response.data || response.data.length === 0) {
        throw new HttpException(`Stock symbol ${normalized} not found`, HttpStatus.NOT_FOUND);
      }

      const quote = response.data[0];
      if (!quote) {
        throw new HttpException(`Stock symbol ${normalized} not found`, HttpStatus.NOT_FOUND);
      }
      return quote;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Never leak upstream provider details to clients.
      throw new HttpException('Failed to fetch stock quote', HttpStatus.BAD_GATEWAY);
    }
  }

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    const normalized = query.trim();
    if (!QUERY_RE.test(normalized)) {
      throw new BadRequestException('Invalid search query');
    }
    const apiKey = this.getApiKey();

    try {
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(normalized)}&limit=10&apikey=${encodeURIComponent(apiKey)}`;
      const response: AxiosResponse<StockSearchResult[]> = await firstValueFrom(
        this.httpService.get<StockSearchResult[]>(url, { timeout: 10_000 }),
      );
      return response.data ?? [];
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to search stocks', HttpStatus.BAD_GATEWAY);
    }
  }
}
