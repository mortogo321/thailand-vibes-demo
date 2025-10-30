import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true, uppercase: true })
  symbol: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true, min: 0 })
  shares: number;

  @Prop({ required: true, min: 0 })
  purchasePrice: number;

  @Prop()
  purchaseDate: Date;

  @Prop()
  notes: string;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

// Create index for faster queries
PortfolioSchema.index({ symbol: 1 });
