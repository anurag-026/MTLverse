@echo off
REM MTLverse Development Setup Script for Windows
REM This script sets up the development environment for MTLverse

echo 🚀 Setting up MTLverse development environment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)
echo [INFO] Docker is installed

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)
echo [INFO] Docker Compose is installed

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)
echo [INFO] Node.js is installed

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed. Please install Java 17+ first.
    exit /b 1
)
echo [INFO] Java is installed

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.9+ first.
    exit /b 1
)
echo [INFO] Python is installed

REM Check if Flutter is installed
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Flutter is not installed. Mobile development will not be available.
    echo [WARNING] Please install Flutter 3.0+ if you want to develop the mobile app.
) else (
    echo [INFO] Flutter is installed
)

REM Create environment file
if not exist .env (
    echo [INFO] Creating .env file from template...
    copy env.example .env
    echo [WARNING] Please edit .env file with your actual configuration values
) else (
    echo [INFO] .env file already exists
)

REM Start infrastructure services
echo [INFO] Starting infrastructure services (PostgreSQL, Redis, etc.)...
docker-compose up -d postgres redis rabbitmq elasticsearch minio

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Setup backend
echo [INFO] Setting up backend...
cd backend
call mvnw flyway:migrate
cd ..
echo [INFO] Backend setup completed

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend
call npm install
cd ..
echo [INFO] Frontend setup completed

REM Setup ML service
echo [INFO] Setting up ML service...
cd ml-services
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..
echo [INFO] ML service setup completed

REM Setup mobile (if Flutter is available)
flutter --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Setting up mobile app...
    cd mobile
    flutter pub get
    cd ..
    echo [INFO] Mobile app setup completed
) else (
    echo [WARNING] Skipping mobile setup (Flutter not installed)
)

echo [INFO] 🎉 Development environment setup completed!
echo.
echo [INFO] Next steps:
echo [INFO] 1. Edit .env file with your configuration
echo [INFO] 2. Start the development servers:
echo [INFO]    - Backend: cd backend ^&^& mvnw spring-boot:run
echo [INFO]    - Frontend: cd frontend ^&^& npm start
echo [INFO]    - ML Service: cd ml-services ^&^& venv\Scripts\activate.bat ^&^& uvicorn main:app --reload
echo [INFO]    - Mobile: cd mobile ^&^& flutter run (if Flutter is installed)
echo.
echo [INFO] Access the applications:
echo [INFO] - Frontend: http://localhost:3000
echo [INFO] - Backend API: http://localhost:8080/api
echo [INFO] - ML Service: http://localhost:8000
echo [INFO] - API Documentation: http://localhost:8080/api/docs
echo [INFO] - ML Service Docs: http://localhost:8000/docs

pause
