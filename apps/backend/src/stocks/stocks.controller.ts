import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':symbol/quote')
  getQuote(@Param('symbol') symbol: string) {
    return this.stocksService.getQuote(symbol);
  }

  @Get('search')
  searchStocks(@Query('q') query: string) {
    return this.stocksService.searchStocks(query);
  }
}
