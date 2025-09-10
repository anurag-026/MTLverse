# MTLverse Project Plan - Core Implementation

## 🎯 **Current Focus: Core MVP**
This document outlines the essential components for MTLverse MVP. Advanced features (ML services, cloud deployment, etc.) will be added later when needed.

## 🏗️ **Core Architecture**

### **Frontend (React.js + JavaScript)**
- **React.js** with JavaScript (no TypeScript for now)
- **Next.js** for SSR and routing
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **Reader**: Virtualized list with overlay rendering

### **Mobile (Flutter)**
- **Flutter** with Dart
- **dio** for API calls
- **cached_network_image** for image caching
- **CustomPainter** for overlay rendering

### **Backend (Spring Boot)**
- **Spring Boot 3** with Java 17
- **Spring Security** with JWT
- **Spring Data JPA** with PostgreSQL
- **Redis** for caching and job queues
- **Local file storage** (simple and free)

### **Database (PostgreSQL)**
- **PostgreSQL** as primary database
- **Flyway** for migrations
- **Core tables**: manga, chapters, pages, regions, overlays

## 📊 **Database Schema (Core Tables)**

### **Essential Tables**
```sql
-- Providers (manga sources)
provider(id, name, base_url, enabled)

-- Manga/Webtoon metadata
manga(id, slug, title_en, title_native, cover_url, synopsis, tags[], status, created_at, updated_at)

-- Chapter information
chapter(id, manga_id, number, title, lang, page_count, released_at, status, created_at, updated_at)

-- Page images
page(id, chapter_id, index, image_url, width, height, created_at)

-- Text regions (balloons, boxes)
region(id, page_id, type, polygon_json, bbox_json, created_at)

-- OCR text
ocr_span(id, region_id, source_lang, text_raw, confidence, created_at)

-- Translated text
mt_span(id, ocr_span_id, target_lang, text_translated, engine, created_at)

-- Overlay data
overlay(id, page_id, overlay_json_url, version, created_at)

-- Users
user(id, email, role, password_hash, created_at)

-- Jobs (for future ML processing)
job(id, type, status, payload_json, created_at, updated_at)
```

## 🔌 **API Contracts (Core Endpoints)**

### **Authentication**
- `POST /auth/login` → JWT token
- `POST /auth/refresh` → Refresh token
- `POST /auth/logout` → Invalidate token

### **Manga Catalog**
- `GET /manga?query=&tag=&page=` → List manga
- `GET /manga/{id}` → Manga details
- `GET /manga/{id}/chapters?page=` → Chapter list

### **Reading**
- `GET /chapters/{id}/pages` → Page images
- `GET /chapters/{id}/overlays` → Overlay data
- `POST /chapters/{id}/process` → Trigger processing (admin)

### **Admin**
- `POST /providers/{name}/sync/manga/{id}` → Sync specific manga
- `POST /providers/{name}/sync/popular` → Sync popular manga

## 📁 **File Storage Structure**
```
uploads/
├── manga/
│   ├── {manga-id}/
│   │   ├── covers/
│   │   └── chapters/
│   │       └── {chapter-id}/
│   │           ├── pages/
│   │           └── overlays/
└── temp/
```

## 🎨 **Frontend Components (React.js)**

### **Core Components**
- `MangaList` - Display manga catalog
- `MangaDetail` - Manga information page
- `ChapterList` - Chapter listing
- `Reader` - Main reading interface
- `OverlayRenderer` - Render text overlays
- `Navigation` - Reader navigation

### **Reader Features**
- **Webtoon mode**: Vertical scrolling
- **Paged mode**: Horizontal page turning
- **Overlay rendering**: SVG-based text overlays
- **Image preloading**: Next page prefetch
- **Progress tracking**: Reading position

## 📱 **Mobile Components (Flutter)**

### **Core Screens**
- `MangaListScreen` - Catalog view
- `MangaDetailScreen` - Manga info
- `ReaderScreen` - Reading interface
- `OverlayWidget` - Text overlay rendering

### **Features**
- **Cached images**: Local storage
- **Smooth scrolling**: Custom scroll physics
- **Gesture support**: Pinch, pan, tap
- **Offline reading**: Download chapters

## 🔧 **Environment Configuration**

### **Backend (.env)**
```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/mtlverse
DB_USER=mtlverse_user
DB_PASS=mtlverse_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# File Storage
FILE_STORAGE_PATH=./uploads
FILE_STORAGE_URL=http://localhost:8081

# External APIs (for future)
MANGA_API_KEY=your-api-key
TRANSLATE_ENGINE=deepl
DEEPL_KEY=your-deepl-key
```

### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_CDN_URL=http://localhost:8081/files
```

### **Mobile (config)**
```dart
const String API_BASE_URL = 'http://localhost:8080/api';
const String CDN_BASE_URL = 'http://localhost:8081/files';
```

## 🚀 **Development Setup**

### **Prerequisites**
- Java 17+
- Node.js 18+
- Flutter 3.0+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose

### **Quick Start**
```bash
# 1. Start infrastructure
docker-compose up -d postgres redis

# 2. Setup backend
cd backend
./mvnw flyway:migrate
./mvnw spring-boot:run

# 3. Setup frontend
cd frontend
npm install
npm run dev

# 4. Setup mobile
cd mobile
flutter pub get
flutter run
```

## 📋 **MVP Milestones**

### **Phase 1: Core Infrastructure (Week 1)**
- [x] Database schema and migrations
- [x] Spring Boot API skeleton
- [x] React.js frontend setup
- [x] Flutter mobile setup
- [x] Basic file storage

### **Phase 2: Basic Reading (Week 2)**
- [ ] Manga catalog API
- [ ] Chapter listing API
- [ ] Page serving API
- [ ] Basic reader interface
- [ ] Image loading and caching

### **Phase 3: Overlay System (Week 3)**
- [ ] Overlay JSON structure
- [ ] Overlay rendering in React
- [ ] Overlay rendering in Flutter
- [ ] Text positioning and styling

### **Phase 4: User Features (Week 4)**
- [ ] User authentication
- [ ] Reading progress tracking
- [ ] Favorites and bookmarks
- [ ] Search functionality

## 🔮 **Future Enhancements (To Be Added Later)**

### **ML Services**
- OCR processing
- Translation services
- Text detection
- Inpainting (optional)

### **Advanced Features**
- Real-time processing
- Advanced caching
- CDN integration
- Analytics and monitoring

### **Deployment**
- Docker containers
- Kubernetes orchestration
- Cloud deployment
- CI/CD pipelines

### **Additional Services**
- Elasticsearch for search
- Message queues for processing
- Cloud storage integration
- Monitoring and logging

## 📝 **Implementation Notes**

### **Current Focus**
- Keep it simple and functional
- Focus on core reading experience
- Use local file storage
- Basic authentication
- Simple overlay system

### **Code Organization**
- Monorepo structure
- Clear separation of concerns
- Consistent naming conventions
- Comprehensive documentation

### **Testing Strategy**
- Unit tests for core logic
- Integration tests for APIs
- Manual testing for UI
- Performance testing for reader

---

**This plan focuses on building a solid foundation that can be extended later with advanced features.**
