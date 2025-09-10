# MTLverse Frontend Plan

## 🎯 **Project Overview**
A modern, interactive webtoon/manga reading platform with AI translation capabilities. The frontend should provide an excellent reading experience with smooth navigation and beautiful UI.

## 🏗️ **Website Structure & Pages**

### **Public Pages (No Auth Required)**
1. **Home Page** (`/`) - Landing page with featured manga, trending, new releases
2. **Manga Catalog** (`/manga`) - Browse all manga with filters and search
3. **Manga Detail** (`/manga/[id]`) - Individual manga page with chapters
4. **Chapter Reader** (`/manga/[id]/chapter/[chapterId]`) - Main reading interface
5. **Search Results** (`/search`) - Search results page
6. **About** (`/about`) - About the platform
7. **Contact** (`/contact`) - Contact information

### **Optional Auth Pages**
8. **Login** (`/login`) - User login (optional)
9. **Register** (`/register`) - User registration (optional)
10. **Profile** (`/profile`) - User profile (requires auth)
11. **Favorites** (`/favorites`) - User's favorite manga (requires auth)
12. **Reading History** (`/history`) - Reading progress (requires auth)
13. **Settings** (`/settings`) - User preferences (requires auth)

## 🎨 **UI Design Principles**

### **Design System**
- **Color Scheme**: Dark/Light theme support
- **Typography**: Clean, readable fonts (Inter for UI, Anime Ace for manga text)
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible components
- **Responsive**: Mobile-first design approach

### **Key UI Features**
- **Smooth Animations**: Fade, slide, and scale transitions
- **Loading States**: Skeleton screens and spinners
- **Interactive Elements**: Hover effects, focus states
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Lazy loading, image optimization

## 📁 **Folder Structure**

```
frontend/
├── src/
│   ├── pages/                    # All route pages
│   │   ├── home/
│   │   │   ├── home.jsx
│   │   │   └── home.css
│   │   ├── manga/
│   │   │   ├── catalog/
│   │   │   │   ├── catalog.jsx
│   │   │   │   └── catalog.css
│   │   │   ├── detail/
│   │   │   │   ├── detail.jsx
│   │   │   │   └── detail.css
│   │   │   └── reader/
│   │   │       ├── reader.jsx
│   │   │       └── reader.css
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── login.jsx
│   │   │   │   └── login.css
│   │   │   └── register/
│   │   │       ├── register.jsx
│   │   │       └── register.css
│   │   ├── user/
│   │   │   ├── profile/
│   │   │   │   ├── profile.jsx
│   │   │   │   └── profile.css
│   │   │   ├── favorites/
│   │   │   │   ├── favorites.jsx
│   │   │   │   └── favorites.css
│   │   │   └── history/
│   │   │       ├── history.jsx
│   │   │       └── history.css
│   │   ├── search/
│   │   │   ├── search.jsx
│   │   │   └── search.css
│   │   ├── about/
│   │   │   ├── about.jsx
│   │   │   └── about.css
│   │   └── contact/
│   │       ├── contact.jsx
│   │       └── contact.css
│   ├── components/               # Reusable components
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   │   ├── header.jsx
│   │   │   │   └── header.css
│   │   │   ├── footer/
│   │   │   │   ├── footer.jsx
│   │   │   │   └── footer.css
│   │   │   └── sidebar/
│   │   │       ├── sidebar.jsx
│   │   │       └── sidebar.css
│   │   ├── manga/
│   │   │   ├── manga-card/
│   │   │   │   ├── manga-card.jsx
│   │   │   │   └── manga-card.css
│   │   │   ├── manga-grid/
│   │   │   │   ├── manga-grid.jsx
│   │   │   │   └── manga-grid.css
│   │   │   ├── chapter-list/
│   │   │   │   ├── chapter-list.jsx
│   │   │   │   └── chapter-list.css
│   │   │   └── reader/
│   │   │       ├── page-viewer/
│   │   │       │   ├── page-viewer.jsx
│   │   │       │   └── page-viewer.css
│   │   │       ├── overlay-renderer/
│   │   │       │   ├── overlay-renderer.jsx
│   │   │       │   └── overlay-renderer.css
│   │   │       └── reader-controls/
│   │   │           ├── reader-controls.jsx
│   │   │           └── reader-controls.css
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── button.jsx
│   │   │   │   └── button.css
│   │   │   ├── input/
│   │   │   │   ├── input.jsx
│   │   │   │   └── input.css
│   │   │   ├── modal/
│   │   │   │   ├── modal.jsx
│   │   │   │   └── modal.css
│   │   │   ├── loading/
│   │   │   │   ├── loading.jsx
│   │   │   │   └── loading.css
│   │   │   └── skeleton/
│   │   │       ├── skeleton.jsx
│   │   │       └── skeleton.css
│   │   └── common/
│   │       ├── search-bar/
│   │       │   ├── search-bar.jsx
│   │       │   └── search-bar.css
│   │       ├── filter-panel/
│   │       │   ├── filter-panel.jsx
│   │       │   └── filter-panel.css
│   │       └── pagination/
│   │           ├── pagination.jsx
│   │           └── pagination.css
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useManga.js
│   │   ├── useReader.js
│   │   └── useLocalStorage.js
│   ├── services/                # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── mangaService.js
│   │   └── readerService.js
│   ├── utils/                   # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── formatters.js
│   ├── context/                 # React Context
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── ReaderContext.js
│   └── styles/                  # Global styles
│       ├── globals.css
│       ├── variables.css
│       └── animations.css
```

## 🎨 **Key UI Components**

### **Layout Components**
- **Header**: Logo, navigation, search, user menu
- **Footer**: Links, social media, copyright
- **Sidebar**: Navigation, filters, categories

### **Manga Components**
- **MangaCard**: Individual manga display with cover, title, rating
- **MangaGrid**: Grid layout for manga display
- **ChapterList**: List of chapters with progress indicators
- **PageViewer**: Main reading interface with zoom, pan
- **OverlayRenderer**: Text overlay rendering system
- **ReaderControls**: Navigation, settings, fullscreen

### **UI Components**
- **Button**: Primary, secondary, ghost variants
- **Input**: Text, search, select inputs
- **Modal**: Confirmation, settings, info modals
- **Loading**: Spinners, skeletons, progress bars
- **Skeleton**: Loading placeholders

## 🚀 **Development Phases**

### **Phase 1: Foundation (Week 1)**
- [ ] Set up folder structure
- [ ] Create base layout components
- [ ] Implement theme system
- [ ] Build basic UI components
- [ ] Set up routing

### **Phase 2: Core Pages (Week 2)**
- [ ] Home page with featured content
- [ ] Manga catalog with filters
- [ ] Manga detail page
- [ ] Basic reader interface
- [ ] Search functionality

### **Phase 3: Reading Experience (Week 3)**
- [ ] Advanced reader with zoom/pan
- [ ] Overlay rendering system
- [ ] Reading progress tracking
- [ ] Reader settings and preferences
- [ ] Mobile optimization

### **Phase 4: User Features (Week 4)**
- [ ] Optional authentication
- [ ] User profile and settings
- [ ] Favorites and bookmarks
- [ ] Reading history
- [ ] Advanced search and filters

## 🎯 **Key Features**

### **Reading Experience**
- **Webtoon Mode**: Vertical scrolling
- **Paged Mode**: Horizontal page turning
- **Zoom & Pan**: Touch and mouse support
- **Overlay System**: Text translation overlays
- **Progress Tracking**: Reading position
- **Offline Support**: Download chapters

### **Navigation**
- **Smooth Transitions**: Page transitions
- **Breadcrumbs**: Navigation context
- **Back Button**: Browser integration
- **Keyboard Shortcuts**: Power user features

### **Performance**
- **Lazy Loading**: Images and components
- **Virtual Scrolling**: Large lists
- **Image Optimization**: WebP, responsive sizes
- **Caching**: API and image caching

## 🔧 **Technical Requirements**

### **Dependencies**
- **react.js 13**: App Router, SSR, SSG
- **React 18**: Hooks, Suspense, Concurrent
- **Tailwind CSS**: Utility-first styling
- **React Query**: Data fetching and caching
- **Framer Motion**: Animations
- **React Hook Form**: Form handling

### **Performance**
- **Core Web Vitals**: LCP, FID, CLS
- **Lighthouse Score**: 90+ on all metrics
- **Bundle Size**: < 500KB initial load
- **Image Optimization**: react.js Image component

### **Accessibility**
- **WCAG 2.1 AA**: Compliance
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels
- **Color Contrast**: 4.5:1 ratio

---

**This plan provides a solid foundation for building a modern, interactive manga reading platform!**
