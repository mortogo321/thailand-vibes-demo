import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
// biome-ignore lint/style/useImportType: NestJS validation metatype needs value imports
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
// biome-ignore lint/style/useImportType: NestJS validation metatype needs value imports
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
// biome-ignore lint/style/useImportType: NestJS constructor DI needs a value import
import { PortfolioService } from './portfolio.service';

@UseGuards(ThrottlerGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePortfolioDto: UpdatePortfolioDto) {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(id);
  }
}
