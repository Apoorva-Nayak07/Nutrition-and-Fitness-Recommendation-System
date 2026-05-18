#!/bin/bash

# FitAI Setup Script
# This script automates the setup process for the FitAI application

set -e

echo "🏋️  FitAI - AI-Powered Nutrition & Fitness System"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python is installed: $PYTHON_VERSION"
else
    print_error "Python is not installed. Please install Python 3.11+ from https://python.org/"
    exit 1
fi

# Check pip
if command_exists pip3; then
    PIP_VERSION=$(pip3 --version)
    print_success "pip is installed: $PIP_VERSION"
else
    print_error "pip is not installed"
    exit 1
fi

# Check MongoDB
if command_exists mongod; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    print_success "MongoDB is installed: $MONGO_VERSION"
else
    print_info "MongoDB is not installed locally. You can use Docker or install from https://www.mongodb.com/"
fi

# Check Docker (optional)
if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker is installed: $DOCKER_VERSION"
else
    print_info "Docker is not installed (optional). Install from https://www.docker.com/"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install root dependencies
print_info "Installing root dependencies..."
npm install
print_success "Root dependencies installed"

# Install backend dependencies
print_info "Installing backend dependencies..."
cd server
npm install
cd ..
print_success "Backend dependencies installed"

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd client
npm install
cd ..
print_success "Frontend dependencies installed"

# Install Python dependencies
print_info "Installing Python dependencies..."
cd ml-service
pip3 install -r requirements.txt
cd ..
print_success "Python dependencies installed"

echo ""
echo "Setting up environment files..."
echo ""

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    print_info "server/.env already exists"
else
    print_success "server/.env is configured"
fi

if [ ! -f "client/.env" ]; then
    print_info "client/.env already exists"
else
    print_success "client/.env is configured"
fi

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start MongoDB:"
echo "   ${YELLOW}docker run -d -p 27017:27017 --name mongodb mongo:7.0${NC}"
echo "   OR use your local MongoDB installation"
echo ""
echo "2. Start all services:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Access the application:"
echo "   Frontend:  ${GREEN}http://localhost:3000${NC}"
echo "   Backend:   ${GREEN}http://localhost:5000${NC}"
echo "   ML Service: ${GREEN}http://localhost:8000${NC}"
echo ""
echo "Alternative: Use Docker"
echo "   ${YELLOW}docker-compose up --build${NC}"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Main documentation"
echo "   - docs/QUICK_START.md - Quick start guide"
echo "   - docs/API.md - API documentation"
echo ""
echo "🎉 Happy coding!"
echo ""
