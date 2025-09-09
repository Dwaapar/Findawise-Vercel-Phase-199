#!/bin/bash

# 🛑 FINDAWISE EMPIRE - STOP SCRIPT
# ==================================
# Gracefully stop your empire application

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
WHITE='\033[1;37m'
NC='\033[0m'

echo -e "${BLUE}🛑 STOPPING FINDAWISE EMPIRE${NC}"
echo -e "${BLUE}============================${NC}"
echo ""

# Find and stop processes on port 5000
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping application on port 5000...${NC}"
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    sleep 2
    echo -e "${GREEN}✅ Application stopped${NC}"
else
    echo -e "${GREEN}✅ No application running on port 5000${NC}"
fi

# Stop any npm/node processes related to the project
echo -e "${YELLOW}Cleaning up background processes...${NC}"
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 1

echo -e "${GREEN}✅ Empire shutdown complete${NC}"
echo ""
echo -e "${WHITE}💡 To restart your empire, run: ${GREEN}./empire-setup.sh${NC}"