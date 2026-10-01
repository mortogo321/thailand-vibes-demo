import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
// biome-ignore lint/style/useImportType: NestJS constructor DI needs a value import
import { StocksService } from './stocks.service';

@UseGuards(ThrottlerGuard)
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
