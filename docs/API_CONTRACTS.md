# MTLverse API Contracts

## 🔌 **Core API Endpoints**

### **Authentication**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}

Response:
{
  "token": "new-jwt-token-here"
}
```

```http
POST /auth/logout
Authorization: Bearer jwt-token-here

Response:
{
  "message": "Logged out successfully"
}
```

### **Manga Catalog**
```http
GET /manga?query=&tag=&page=1&limit=20

Response:
{
  "data": [
    {
      "id": "uuid",
      "slug": "one-piece",
      "titleEn": "One Piece",
      "titleNative": "ワンピース",
      "coverUrl": "https://cdn.mtlverse.com/covers/one-piece.jpg",
      "synopsis": "Monkey D. Luffy...",
      "tags": ["adventure", "shounen", "action"],
      "status": "ONGOING",
      "rating": 4.8,
      "ratingCount": 1250,
      "viewCount": 50000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

```http
GET /manga/{id}

Response:
{
  "id": "uuid",
  "slug": "one-piece",
  "titleEn": "One Piece",
  "titleNative": "ワンピース",
  "coverUrl": "https://cdn.mtlverse.com/covers/one-piece.jpg",
  "synopsis": "Monkey D. Luffy...",
  "tags": ["adventure", "shounen", "action"],
  "status": "ONGOING",
  "rating": 4.8,
  "ratingCount": 1250,
  "viewCount": 50000,
  "chapters": [
    {
      "id": "uuid",
      "number": 1,
      "title": "Romance Dawn",
      "pageCount": 20,
      "releasedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### **Chapters**
```http
GET /manga/{id}/chapters?page=1&limit=20

Response:
{
  "data": [
    {
      "id": "uuid",
      "number": 1,
      "title": "Romance Dawn",
      "pageCount": 20,
      "releasedAt": "2023-01-01T00:00:00Z",
      "status": "ONGOING"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### **Reading**
```http
GET /chapters/{id}/pages

Response:
{
  "pages": [
    {
      "index": 1,
      "imageUrl": "https://cdn.mtlverse.com/pages/chapter-uuid/1.jpg",
      "width": 1280,
      "height": 1920
    },
    {
      "index": 2,
      "imageUrl": "https://cdn.mtlverse.com/pages/chapter-uuid/2.jpg",
      "width": 1280,
      "height": 1920
    }
  ]
}
```

```http
GET /chapters/{id}/overlays

Response:
{
  "overlays": [
    {
      "page": 1,
      "overlayUrl": "https://cdn.mtlverse.com/overlays/chapter-uuid/1.json"
    },
    {
      "page": 2,
      "overlayUrl": "https://cdn.mtlverse.com/overlays/chapter-uuid/2.json"
    }
  ]
}
```

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
        "stroke": true,
        "color": "#000000",
        "strokeColor": "#ffffff"
      }
    }
  ]
}
```

### **User Data**
```http
GET /users/profile
Authorization: Bearer jwt-token-here

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

```http
GET /users/reading-progress
Authorization: Bearer jwt-token-here

Response:
{
  "data": [
    {
      "chapterId": "uuid",
      "mangaId": "uuid",
      "mangaTitle": "One Piece",
      "chapterNumber": 1,
      "pageIndex": 15,
      "readAt": "2023-01-01T12:00:00Z"
    }
  ]
}
```

```http
POST /users/reading-progress
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "chapterId": "uuid",
  "pageIndex": 15
}

Response:
{
  "message": "Progress updated successfully"
}
```

```http
GET /users/favorites
Authorization: Bearer jwt-token-here

Response:
{
  "data": [
    {
      "id": "uuid",
      "mangaId": "uuid",
      "mangaTitle": "One Piece",
      "coverUrl": "https://cdn.mtlverse.com/covers/one-piece.jpg",
      "addedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

```http
POST /users/favorites
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "mangaId": "uuid"
}

Response:
{
  "message": "Added to favorites"
}
```

### **Admin Endpoints**
```http
POST /admin/chapters/{id}/process
Authorization: Bearer admin-jwt-token-here

Response:
{
  "message": "Processing started",
  "jobId": "uuid"
}
```

```http
POST /admin/providers/{name}/sync/manga/{providerMangaId}
Authorization: Bearer admin-jwt-token-here

Response:
{
  "message": "Sync started",
  "jobId": "uuid"
}
```

```http
POST /admin/providers/{name}/sync/popular
Authorization: Bearer admin-jwt-token-here

Response:
{
  "message": "Popular manga sync started",
  "jobId": "uuid"
}
```

## 🔧 **Error Responses**

### **Standard Error Format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### **Common Error Codes**
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

## 📊 **Response Headers**

### **Standard Headers**
```
Content-Type: application/json
X-Request-ID: uuid
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1640995200
```

### **Pagination Headers**
```
X-Pagination-Page: 1
X-Pagination-Limit: 20
X-Pagination-Total: 100
X-Pagination-Total-Pages: 5
```

## 🔐 **Authentication**

### **JWT Token Structure**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### **Token Expiration**
- Access Token: 24 hours
- Refresh Token: 7 days

## 📝 **Request Examples**

### **cURL Examples**
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get manga list
curl -X GET "http://localhost:8080/api/manga?page=1&limit=20" \
  -H "Authorization: Bearer jwt-token-here"

# Get chapter pages
curl -X GET http://localhost:8080/api/chapters/uuid/pages \
  -H "Authorization: Bearer jwt-token-here"
```

### **JavaScript Examples**
```javascript
// Using fetch
const response = await fetch('/api/manga', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Using axios
const response = await axios.get('/api/manga', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🚀 **Rate Limiting**

### **Limits**
- **Authenticated users**: 100 requests/minute
- **Unauthenticated users**: 20 requests/minute
- **Admin users**: 500 requests/minute

### **Headers**
```
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1640995200
```

## 📱 **Mobile API Considerations**

### **Image Optimization**
- Images are automatically optimized for mobile
- Different sizes available: `?w=400`, `?w=800`, `?w=1200`
- WebP format when supported

### **Offline Support**
- ETags for caching
- Last-Modified headers
- Conditional requests support

---

**This API contract provides a solid foundation for the MTLverse platform.**
