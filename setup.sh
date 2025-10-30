#!/bin/bash

echo "🚀 Setting up Stock Management Application..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
else
    echo "✅ pnpm is installed"
fi

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start it with: mongod --dbpath /path/to/data"
    fi
else
    echo "⚠️  MongoDB is not installed"
    echo "   Install from: https://www.mongodb.com/docs/manual/installation/"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Create .env file if it doesn't exist
if [ ! -f "apps/backend/.env" ]; then
    echo ""
    echo "📝 Creating backend .env file..."
    cp apps/backend/.env.example apps/backend/.env
    echo "⚠️  Please update apps/backend/.env with your:"
    echo "   - MongoDB URI"
    echo "   - Financial Modeling Prep API key"
    echo "   Get your API key from: https://site.financialmodelingprep.com/developer/docs"
else
    echo "✅ Backend .env file already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update apps/backend/.env with your MongoDB URI and API key"
echo "2. Run 'pnpm dev' to start both backend and frontend"
echo "3. Visit http://localhost:5173 to see the app"
echo ""
