#!/bin/bash

# AUTONOMOUS AI CTO LAUNCHER
# 
# This script launches your AI CTO system to fix TypeScript errors

echo "🤖 AUTONOMOUS AI CTO - STARTING UP"
echo "🎯 Mission: Fix 6,213 TypeScript errors with zero degradation"
echo "💾 GPU: Optimized for 12GB RTX"
echo ""

# Check if we're in the right directory
if [ ! -f "ai-cto.js" ]; then
    echo "❌ Please run this script from the ai-cto-project directory"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if parent project exists
if [ ! -f "../package.json" ]; then
    echo "❌ Parent project not found. Make sure ai-cto-project is in your project root."
    exit 1
fi

echo "✅ Target project found"

# Check for TypeScript
cd ..
if ! command -v npx &> /dev/null || ! npx tsc --version &> /dev/null; then
    echo "❌ TypeScript not found in target project"
    exit 1
fi

echo "✅ TypeScript found: $(npx tsc --version)"
cd ai-cto-project

# Create backups directory
mkdir -p backups

echo ""
echo "🚀 STARTING AI CTO SYSTEM..."
echo ""

# Launch AI CTO
node ai-cto.js

echo ""
echo "🎉 AI CTO SESSION COMPLETED"
echo "📊 Check the backups/ directory for logs and reports"
echo "📋 Review any pending approvals if requested"