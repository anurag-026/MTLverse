# MTLverse Architecture Documentation

## System Overview

MTLverse is a microservices-based webtoon reading platform with AI translation capabilities. The system is designed for scalability, maintainability, and cost-effectiveness.

## Core Components

### 1. Frontend (React.js)
- **Location**: `frontend/`
- **Technology**: React 18, TypeScript, Material-UI, Redux Toolkit
- **Features**:
  - Responsive web design
  - Progressive Web App (PWA) capabilities
  - Real-time updates via WebSocket
  - Offline reading support
  - Dark/Light theme support

### 2. Mobile (Flutter)
- **Location**: `mobile/`
- **Technology**: Flutter 3.0+, Dart, Provider/Riverpod
- **Features**:
  - Cross-platform mobile app
  - Offline reading with local storage
  - Push notifications
  - Biometric authentication
  - Smooth reading experience

### 3. Backend (Spring Boot)
- **Location**: `backend/`
- **Technology**: Spring Boot 3.0+, Java 17, Spring Security, JPA
- **Features**:
  - RESTful APIs
  - JWT authentication
  - Rate limiting
  - Caching with Redis
  - File upload handling
  - WebSocket support

### 4. ML Services (Python)
- **Location**: `ml-services/`
- **Technology**: Python 3.9+, FastAPI, PyTorch, Transformers
- **Features**:
  - Text translation using AI models
  - Image text extraction (OCR)
  - Language detection
  - Translation quality assessment

## Database Design

### PostgreSQL Schema

#### Core Tables
```sql
-- Users and Authentication
users (id, username, email, password_hash, created_at, updated_at)
user_profiles (id, user_id, display_name, avatar_url, preferences)
user_sessions (id, user_id, token, expires_at, created_at)

-- Webtoon Content
webtoons (id, title, description, author, status, genre, rating, cover_image_url)
chapters (id, webtoon_id, chapter_number, title, pages_count, published_at)
pages (id, chapter_id, page_number, image_url, text_content, translated_text)
translations (id, page_id, source_language, target_language, translated_text, confidence_score)

-- User Interactions
reading_progress (id, user_id, chapter_id, page_number, read_at)
favorites (id, user_id, webtoon_id, created_at)
bookmarks (id, user_id, chapter_id, page_number, created_at)
ratings (id, user_id, webtoon_id, rating, review, created_at)

-- System Management
api_calls (id, api_name, endpoint, called_at, response_time, status)
cache_entries (id, cache_key, data, expires_at, created_at)
translation_jobs (id, page_id, status, started_at, completed_at, error_message)
```

### Redis Caching Strategy
- **User sessions**: 24 hours TTL
- **Webtoon metadata**: 1 hour TTL
- **Chapter content**: 30 minutes TTL
- **Translation results**: 7 days TTL
- **API responses**: 15 minutes TTL

## API Design

### RESTful Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

#### Webtoons
- `GET /api/webtoons` - List webtoons with pagination
- `GET /api/webtoons/{id}` - Get webtoon details
- `GET /api/webtoons/{id}/chapters` - Get chapters
- `GET /api/webtoons/{id}/chapters/{chapterId}` - Get chapter content

#### User Data
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/reading-progress` - Get reading progress
- `POST /api/users/reading-progress` - Update reading progress
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites` - Add to favorites

#### Translation
- `POST /api/translate` - Request translation
- `GET /api/translate/status/{jobId}` - Check translation status
- `GET /api/translate/languages` - Get supported languages

### WebSocket Events
- `reading_progress_update` - Real-time reading progress
- `translation_complete` - Translation job completion
- `new_chapter` - New chapter notification

## External API Integration

### Webtoon APIs
- **Primary API**: Webtoon official API (with API key)
- **Fallback APIs**: Alternative webtoon sources
- **Caching Strategy**: Store responses in database, refresh weekly

### Translation APIs
- **Google Translate API**: Primary translation service
- **DeepL API**: High-quality translation alternative
- **Custom ML Models**: Offline translation for common languages

## Security Architecture

### Authentication & Authorization
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- API rate limiting per user/IP
- CORS configuration for web clients

### Data Protection
- Password hashing with bcrypt
- Sensitive data encryption at rest
- HTTPS enforcement
- Input validation and sanitization

## Performance Optimization

### Caching Strategy
- **L1 Cache**: Application-level caching (Caffeine)
- **L2 Cache**: Redis distributed caching
- **CDN**: Static asset delivery
- **Database**: Query optimization and indexing

### Scalability
- **Horizontal Scaling**: Microservices architecture
- **Load Balancing**: Nginx/HAProxy
- **Database**: Read replicas for read-heavy operations
- **Message Queue**: Async processing for heavy tasks

## Monitoring & Logging

### Application Monitoring
- **Metrics**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger for distributed tracing
- **Health Checks**: Spring Boot Actuator

### Business Metrics
- User engagement tracking
- Translation accuracy metrics
- API usage statistics
- Performance benchmarks

## Deployment Architecture

### Development Environment
- Docker Compose for local development
- Hot reload for all services
- Local database instances

### Production Environment
- Kubernetes orchestration
- CI/CD pipeline with GitHub Actions
- Blue-green deployment strategy
- Auto-scaling based on metrics

### Infrastructure
- **Cloud Provider**: AWS/GCP/Azure
- **Container Registry**: Docker Hub/AWS ECR
- **Database**: Managed PostgreSQL
- **Storage**: S3-compatible object storage
- **CDN**: CloudFront/CloudFlare

## Cost Optimization

### API Usage Optimization
- Smart caching to minimize external API calls
- Batch processing for translations
- Rate limiting to prevent overuse
- Fallback mechanisms for API failures

### Resource Management
- Auto-scaling based on demand
- Spot instances for non-critical workloads
- Database query optimization
- Image compression and optimization

## Future Enhancements

### Phase 2 Features
- Real-time collaborative reading
- Community features (comments, discussions)
- Advanced recommendation system
- Multi-language UI support

### Phase 3 Features
- Mobile app for tablets
- Desktop application (Electron)
- Advanced analytics dashboard
- Machine learning for content curation
