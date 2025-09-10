#!/bin/bash

# MTLverse Development Setup Script
# This script sets up the development environment for MTLverse

set -e

echo "🚀 Setting up MTLverse development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_status "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_status "Docker Compose is installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_status "Node.js is installed: $(node -v)"
}

# Check if Java is installed
check_java() {
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java 17+ first."
        exit 1
    fi
    
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 17 ]; then
        print_error "Java version 17+ is required. Current version: $(java -version 2>&1 | head -n 1)"
        exit 1
    fi
    print_status "Java is installed: $(java -version 2>&1 | head -n 1)"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.9+ first."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 9 ]); then
        print_error "Python 3.9+ is required. Current version: $PYTHON_VERSION"
        exit 1
    fi
    print_status "Python is installed: $PYTHON_VERSION"
}

# Check if Flutter is installed
check_flutter() {
    if ! command -v flutter &> /dev/null; then
        print_warning "Flutter is not installed. Mobile development will not be available."
        print_warning "Please install Flutter 3.0+ if you want to develop the mobile app."
    else
        print_status "Flutter is installed: $(flutter --version | head -n 1)"
    fi
}

# Create environment file
create_env_file() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_status ".env file already exists"
    fi
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services (PostgreSQL, Redis, etc.)..."
    docker-compose up -d postgres redis rabbitmq elasticsearch minio
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Infrastructure services started successfully"
    else
        print_error "Failed to start infrastructure services"
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    # Run database migrations
    print_status "Running database migrations..."
    ./mvnw flyway:migrate
    
    cd ..
    print_status "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    cd ..
    print_status "Frontend setup completed"
}

# Setup ML service
setup_ml_service() {
    print_status "Setting up ML service..."
    cd ml-services
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing ML service dependencies..."
    pip install -r requirements.txt
    
    cd ..
    print_status "ML service setup completed"
}

# Setup mobile (if Flutter is available)
setup_mobile() {
    if command -v flutter &> /dev/null; then
        print_status "Setting up mobile app..."
        cd mobile
        
        # Get dependencies
        print_status "Getting Flutter dependencies..."
        flutter pub get
        
        cd ..
        print_status "Mobile app setup completed"
    else
        print_warning "Skipping mobile setup (Flutter not installed)"
    fi
}

# Main setup function
main() {
    print_status "Starting MTLverse development setup..."
    
    # Check prerequisites
    check_docker
    check_docker_compose
    check_node
    check_java
    check_python
    check_flutter
    
    # Create environment file
    create_env_file
    
    # Start infrastructure
    start_infrastructure
    
    # Setup services
    setup_backend
    setup_frontend
    setup_ml_service
    setup_mobile
    
    print_status "🎉 Development environment setup completed!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Edit .env file with your configuration"
    print_status "2. Start the development servers:"
    print_status "   - Backend: cd backend && ./mvnw spring-boot:run"
    print_status "   - Frontend: cd frontend && npm start"
    print_status "   - ML Service: cd ml-services && source venv/bin/activate && uvicorn main:app --reload"
    print_status "   - Mobile: cd mobile && flutter run (if Flutter is installed)"
    print_status ""
    print_status "Access the applications:"
    print_status "- Frontend: http://localhost:3000"
    print_status "- Backend API: http://localhost:8080/api"
    print_status "- ML Service: http://localhost:8000"
    print_status "- API Documentation: http://localhost:8080/api/docs"
    print_status "- ML Service Docs: http://localhost:8000/docs"
}

# Run main function
main "$@"
