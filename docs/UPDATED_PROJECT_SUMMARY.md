# 🎯 MTLverse - Updated Project Structure

## ✅ **Project Successfully Updated!**

I've completely restructured MTLverse to match your preferred architecture, focusing on core functionality and removing unnecessary complexity.

## 🏗️ **Updated Architecture**

### **Frontend: React.js + JavaScript (No TypeScript)**
- **Next.js 13** with App Router
- **React 18** with JavaScript (not TypeScript)
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **Lucide React** for icons

### **Mobile: Flutter**
- **Flutter 3.0+** with Dart
- **dio** for API calls
- **cached_network_image** for image caching
- **CustomPainter** for overlay rendering

### **Backend: Spring Boot**
- **Spring Boot 3** with Java 17
- **Spring Security** with JWT
- **Spring Data JPA** with PostgreSQL
- **Redis** for caching and job queues
- **Local file storage** (simple and free)

### **Database: PostgreSQL**
- **PostgreSQL** as primary database
- **Flyway** for migrations
- **Core tables**: manga, chapters, pages, regions, overlays

## 📊 **Updated Database Schema**

### **Core Tables (Simplified)**
```sql
-- Providers (manga sources)
provider(id, name, base_url, enabled)

-- Manga/Webtoon metadata
manga(id, slug, title_en, title_native, cover_url, synopsis, tags[], status, rating, view_count)

-- Chapter information
chapter(id, manga_id, number, title, lang, page_count, released_at, status)

-- Page images
page(id, chapter_id, index, image_url, width, height, checksum)

-- Text regions (balloons, boxes)
region(id, page_id, type, polygon_json, bbox_json)

-- OCR text
ocr_span(id, region_id, source_lang, text_raw, confidence, reading_order)

-- Translated text
mt_span(id, ocr_span_id, target_lang, text_translated, engine, glossary_version)

-- Overlay data
overlay(id, page_id, overlay_json_url, version)

-- Users
user(id, email, role, password_hash, is_active)

-- Jobs (for future ML processing)
job(id, type, status, payload_json, error, created_at, updated_at)
```

## 🔌 **API Contracts**

### **Core Endpoints**
- **Authentication**: `/auth/login`, `/auth/refresh`, `/auth/logout`
- **Manga Catalog**: `/manga`, `/manga/{id}`, `/manga/{id}/chapters`
- **Reading**: `/chapters/{id}/pages`, `/chapters/{id}/overlays`
- **User Data**: `/users/profile`, `/users/reading-progress`, `/users/favorites`
- **Admin**: `/admin/chapters/{id}/process`, `/admin/providers/{name}/sync`

### **Overlay JSON Structure**
```json
{
  "pageW": 1280,
  "pageH": 1920,
  "version": "1.0",
  "regions": [
    {
      "id": "r1",
      "type": "balloon",
      "polygon": [[120, 300], [540, 280], [560, 520], [140, 540]],
      "text": "I'll handle this!",
      "style": {
        "font": "AnimeAce",
        "size": 36,
        "align": "center",
        "lineHeight": 1.15,
        "stroke": true
      }
    }
  ]
}
```

## 📁 **Simplified Project Structure**

```
MTL/
├── 📁 frontend/                 # React.js + Next.js
│   ├── package.json            # Updated with Next.js dependencies
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── src/
│       ├── App.js              # Main React component (JavaScript)
│       ├── components/         # React components
│       └── pages/              # Next.js pages
├── 📁 mobile/                   # Flutter mobile app
│   └── pubspec.yaml            # Flutter dependencies
├── 📁 backend/                  # Spring Boot backend
│   ├── pom.xml                 # Maven configuration
│   └── src/main/resources/
│       └── application.yml     # Application configuration
├── 📁 database/                 # Database schema
│   ├── schema.sql              # Updated manga/webtoon schema
│   └── init/
│       └── 01_init.sql         # Database initialization
├── 📁 docs/                     # Documentation
│   ├── PROJECT_PLAN.md         # Core implementation plan
│   └── API_CONTRACTS.md        # API documentation
├── docker-compose.yml           # Local development
├── env.example                  # Environment configuration
└── README.md                    # Project documentation
```

## 🚀 **Quick Start (Updated)**

### **Prerequisites**
- Java 17+
- Node.js 18+
- Flutter 3.0+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose

### **Development Setup**
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

## 🎯 **Key Changes Made**

### ✅ **Removed Complexity**
- ❌ Removed TypeScript (using JavaScript)
- ❌ Removed Material-UI (using Tailwind CSS)
- ❌ Removed Redux (using React Query)
- ❌ Removed complex storage services
- ❌ Removed Kubernetes configurations
- ❌ Removed CI/CD pipelines
- ❌ Removed ML service configurations

### ✅ **Added Core Features**
- ✅ Next.js with App Router
- ✅ Tailwind CSS for styling
- ✅ React Query for data fetching
- ✅ Manga/webtoon database schema
- ✅ Overlay system for text rendering
- ✅ API contracts for all endpoints
- ✅ Local file storage (free)
- ✅ Simplified project structure

## 📋 **MVP Milestones (Updated)**

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

### **ML Services** (When Needed)
- OCR processing
- Translation services
- Text detection
- Inpainting (optional)

### **Advanced Features** (When Needed)
- Real-time processing
- Advanced caching
- CDN integration
- Analytics and monitoring

### **Deployment** (When Needed)
- Docker containers
- Kubernetes orchestration
- Cloud deployment
- CI/CD pipelines

## 🎉 **Ready to Start Development!**

The project is now focused on core functionality with a clean, simple structure:

- **Frontend**: React.js + Next.js + Tailwind CSS
- **Mobile**: Flutter
- **Backend**: Spring Boot + PostgreSQL + Redis
- **Storage**: Local file storage (free)
- **Database**: Manga/webtoon optimized schema
- **API**: Complete contracts for all endpoints

**Start coding immediately with the core features, then add advanced features when needed!**

---

**The project is now perfectly aligned with your preferred architecture and ready for development!** 🚀
