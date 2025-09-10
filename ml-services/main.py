"""
MTLverse ML Services
FastAPI application for translation and OCR services
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging
from typing import List, Optional

from app.core.config import settings
from app.core.database import init_db
from app.core.redis import init_redis
from app.api.v1.api import api_router
from app.core.exceptions import setup_exception_handlers
from app.core.middleware import setup_middleware
from app.services.translation_service import TranslationService
from app.services.ocr_service import OCRService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global services
translation_service: Optional[TranslationService] = None
ocr_service: Optional[OCRService] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting MTLverse ML Services...")
    
    # Initialize database
    await init_db()
    logger.info("Database initialized")
    
    # Initialize Redis
    await init_redis()
    logger.info("Redis initialized")
    
    # Initialize services
    global translation_service, ocr_service
    translation_service = TranslationService()
    ocr_service = OCRService()
    
    logger.info("ML Services started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ML Services...")

# Create FastAPI application
app = FastAPI(
    title="MTLverse ML Services",
    description="AI-powered translation and OCR services for MTLverse",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Setup middleware
setup_middleware(app)

# Setup exception handlers
setup_exception_handlers(app)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MTLverse ML Services",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "translation": translation_service is not None,
            "ocr": ocr_service is not None
        }
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    # This would typically return Prometheus metrics
    return {"message": "Metrics endpoint"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
