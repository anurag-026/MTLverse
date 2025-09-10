# Frontend Structure

This document outlines the structure of the MangaVerse frontend application built with Next.js 15.

## Directory Structure

```
frontend/
└── src/
    ├── app/                 # Next.js App Router pages and routes
    │   ├── layout.js        # Root layout (common UI wrapper)
    │   ├── page.js          # Home page
    │   ├── manga/           # Routes for manga details and reading
    │   │   ├── [mangaId]/   # Dynamic route for a specific manga series
    │   │   │   ├── page.js          # Manga detail page (info & chapters list)
    │   │   │   └── chapter/
    │   │   │       └── [chapterId]/
    │   │   │           └── page.js  # Chapter reader page (manga reading view)
    │   ├── search/
    │   │   └── page.js      # Search results page
    │   ├── login/
    │   │   └── page.js      # Login page
    │   ├── register/
    │   │   └── page.js      # Registration page
    │   ├── favorites/
    │   │   └── page.js      # User's favorite manga list (protected)
    │   └── favicon.ico      # Site favicon
    ├── components/          # Reusable UI components
    │   ├── Header.js        # Site header (logo, nav, search bar, auth links)
    │   ├── Footer.js        # Site footer
    │   ├── MangaCard.js     # Component to display a manga thumbnail + title
    │   ├── MangaList.js     # Grid/List of MangaCard items
    │   ├── ChapterList.js   # List of chapters for a manga
    │   └── ReaderControls.js# Buttons/switches for reader modes & navigation
    ├── lib/                 # Utility modules (API clients, helpers)
    │   ├── apiClient.js     # Functions to call backend API (fetch wrappers)
    │   └── auth.js          # Auth helper (login, token storage, etc.)
    ├── hooks/               # Custom React hooks
    │   └── useAuth.js       # Hook for authentication state (login/logout)
    └── styles/              # Global styles (Tailwind CSS setup)
        └── globals.css      # Global CSS imports (includes Tailwind base)
├── public/                  # Public assets
│   ├── images/              # Image assets (logos, placeholders, icons)
│   │   └── placeholder-manga.jpg
│   └── *.svg               # Next.js default icons
└── ...                     # Config files (package.json, next.config.js, etc.)
```

## Key Features

### Components
- **Header**: Navigation bar with logo, search, and authentication links
- **Footer**: Site footer with links and information
- **MangaCard**: Displays manga cover, title, author, and metadata
- **MangaList**: Grid layout for displaying multiple manga cards
- **ChapterList**: Lists chapters for a specific manga
- **ReaderControls**: Controls for manga reading experience

### Pages
- **Home**: Landing page with featured manga and genre navigation
- **Manga Detail**: Individual manga information and chapter list
- **Chapter Reader**: Full-screen manga reading experience
- **Search**: Search results and filtering
- **Authentication**: Login and registration pages
- **Favorites**: User's saved manga list

### Utilities
- **API Client**: Centralized API communication with backend
- **Auth Helper**: Authentication state management and token handling
- **Custom Hooks**: Reusable React logic (useAuth)

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Custom hooks for state management
- **Next.js Image**: Optimized image loading

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The frontend is designed to work with the backend API. Update the `API_BASE_URL` in `lib/apiClient.js` to match your backend configuration.
