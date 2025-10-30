import { connect, disconnect } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function clearDatabase() {
  try {
    console.log('🗑️  Starting database cleanup...\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-management';
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Import Portfolio model
    const { default: mongoose } = await import('mongoose');
    const PortfolioSchema = new mongoose.Schema({
      symbol: String,
      companyName: String,
      shares: Number,
      purchasePrice: Number,
      purchaseDate: Date,
      notes: String,
    }, { timestamps: true });

    const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

    // Clear all data
    const result = await Portfolio.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} portfolio entries\n`);

    console.log('✨ Database cleanup completed successfully!\n');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the clear function
clearDatabase();
