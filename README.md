# MTLverse - Webtoon Reading Platform with AI Translation

## 🎯 Project Overview
MTLverse is a comprehensive webtoon reading platform that provides:
- Webtoon reading experience across web and mobile platforms
- AI-powered translation of raw manga files from various languages to English
- Smart caching system to minimize external API calls
- User management and reading progress tracking

## 🏗️ Architecture

### Technology Stack
- **Frontend (Web)**: React.js + TypeScript + Material-UI
- **Mobile**: Flutter + Dart
- **Backend**: Spring Boot + Java
- **ML Services**: Python + FastAPI
- **Database**: PostgreSQL + Redis
- **Message Queue**: RabbitMQ
- **File Storage**: Local Storage (FREE) / Cloudflare R2 (FREE) / Supabase (FREE)
- **Search**: Elasticsearch

### Project Structure
```
MTL/
├── frontend/                 # React.js web application
├── mobile/                   # Flutter mobile application
├── backend/                  # Spring Boot backend
├── ml-services/             # Python ML translation services
├── database/                # Database schemas and migrations
├── docker/                  # Docker configurations
├── docs/                    # Documentation
└── deployment/              # Deployment configurations
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Flutter 3.0+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose

### Development Setup
1. Clone the repository
2. Run `docker-compose up -d` for databases
3. Start backend services
4. Start frontend applications
5. Start mobile development server

## 📋 Features

### Core Features
- [ ] User authentication and authorization
- [ ] Webtoon browsing and reading
- [ ] Reading progress tracking
- [ ] Favorites and bookmarks
- [ ] Search and filtering
- [ ] AI-powered translation
- [ ] Offline reading support
- [ ] Cross-platform synchronization

### Advanced Features
- [ ] Recommendation system
- [ ] Community features (comments, ratings)
- [ ] Subscription management
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support

## 🔧 Development

### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Mobile Development
```bash
cd mobile
flutter pub get
flutter run
```

### ML Services Development
```bash
cd ml-services
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `webtoons` - Webtoon metadata
- `chapters` - Chapter information
- `pages` - Page content and images
- `translations` - Translation data
- `reading_progress` - User reading history
- `favorites` - User favorites and bookmarks

## 🔌 API Integration

### External APIs
- Webtoon content APIs (with API key management)
- Translation services (Google Translate, DeepL, etc.)
- Image processing services

### Internal APIs
- RESTful APIs for all CRUD operations
- WebSocket for real-time updates
- GraphQL for complex queries

## 🚀 Deployment

### Production Environment
- Docker containers for all services
- Kubernetes orchestration
- CI/CD pipeline with GitHub Actions
- Monitoring with Prometheus + Grafana
- Logging with ELK Stack

### Environment Variables
See `.env.example` files in each service directory.

## 📝 License
MIT License - see LICENSE file for details.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support
For support and questions, please open an issue or contact the development team.
