#!/bin/bash

set -e

echo "🚀 PetCare AI Development Environment Setup"
echo "==========================================="
echo ""

# Check if running in Codespaces
if [ -n "$CODESPACES" ]; then
  echo "✅ Running in GitHub Codespaces"
else
  echo "📍 Running locally (or in other environment)"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Type checking..."
npm run type-check

echo ""
echo "📝 Environment Configuration"
echo "============================="

if [ ! -f ".env.local" ]; then
  echo "⚠️  .env.local not found. Creating from template..."
  cp .env.example .env.local
  echo "✅ Created .env.local from .env.example"
  echo ""
  echo "📝 Please update .env.local with your configuration:"
  echo "   - Supabase URL and keys"
  echo "   - Google Cloud credentials"
  echo "   - Gemini API key"
else
  echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your credentials"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
