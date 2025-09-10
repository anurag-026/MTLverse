import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEYS = {
  READ_HISTORY: 'readHistory',
  FAVORITE_CHAPTERS: 'favoriteChapters',
  CHAPTER_LIST: 'chapterList',
  SELECTED_MANGA: 'selectedManga',
  FAVORITES: 'favorites',
  BOOKMARKS: 'bookMarks',
};

const MangaContext = createContext(undefined);

export function MangaProvider({ children }) {
  const [selectedManga, setSelectedMangaState] = useState(null);
  const [readHistory, setReadHistory] = useState([]);
  const [favoriteChapters, setFavoriteChapters] = useState([]);
  const [chapterLists, setChapterLists] = useState({});
  const [favorites, setFavorites] = useState({});
  const [bookMarks, setBookMarks] = useState([]);

  useEffect(() => {
    try {
      const sm = localStorage.getItem(STORAGE_KEYS.SELECTED_MANGA);
      if (sm) setSelectedMangaState(JSON.parse(sm));

      const rh = localStorage.getItem(STORAGE_KEYS.READ_HISTORY);
      if (rh) setReadHistory(JSON.parse(rh).map((e) => ({ ...e, lastReadAT: new Date(e.lastReadAT) })));

      const fc = localStorage.getItem(STORAGE_KEYS.FAVORITE_CHAPTERS);
      if (fc) setFavoriteChapters(JSON.parse(fc));

      const cl = localStorage.getItem(STORAGE_KEYS.CHAPTER_LIST);
      if (cl) setChapterLists(JSON.parse(cl));

      const fav = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (fav) setFavorites(JSON.parse(fav));

      const bm = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (bm) setBookMarks(JSON.parse(bm).map((b) => ({ ...b, bookmarkedAt: new Date(b.bookmarkedAt) })));
    } catch (e) {
      console.error('Failed to load manga store', e);
    }
  }, []);

  const setSelectedManga = (manga) => {
    setSelectedMangaState(manga);
    try {
      if (manga) localStorage.setItem(STORAGE_KEYS.SELECTED_MANGA, JSON.stringify(manga));
      else localStorage.removeItem(STORAGE_KEYS.SELECTED_MANGA);
    } catch {}
  };

  const addToReadHistory = (manga, chapter, allChaptersList) => {
    setReadHistory((prev) => {
      const existing = prev.find((e) => e.manga.id === manga.id);
      let updated;
      if (existing) {
        const chapters = chapter ? [chapter, ...existing.chapters.filter((c) => c.id !== chapter.id)] : existing.chapters;
        updated = prev.map((e) => (e.manga.id === manga.id ? { manga, chapters, lastChapterRead: chapter || e.lastChapterRead, allChaptersList: allChaptersList || e.allChaptersList, lastReadAT: new Date() } : e));
      } else {
        updated = [{ manga, chapters: chapter ? [chapter] : [], lastChapterRead: chapter || null, allChaptersList: allChaptersList || [], lastReadAT: new Date() }, ...prev].slice(0, 50);
      }
      try { localStorage.setItem(STORAGE_KEYS.READ_HISTORY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const addToFavoriteChapter = (chapter) => {
    setFavoriteChapters((prev) => {
      const updated = [chapter, ...prev.filter((c) => c.id !== chapter.id)];
      try { localStorage.setItem(STORAGE_KEYS.FAVORITE_CHAPTERS, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const setChapterListForManga = (mangaId, chapters) => {
    setChapterLists((prev) => {
      const updated = { ...prev, [mangaId]: chapters };
      try { localStorage.setItem(STORAGE_KEYS.CHAPTER_LIST, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const addToFavorite = (manga, chapter) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      const id = manga.id;
      if (!updated[id]) updated[id] = { mangaInfo: manga, chapterInfo: [] };
      else updated[id] = { ...updated[id], mangaInfo: manga };
      if (chapter) {
        const exists = updated[id].chapterInfo.some((c) => c.id === chapter.id);
        if (!exists) updated[id].chapterInfo = [chapter, ...updated[id].chapterInfo];
        else {
          updated[id].chapterInfo = updated[id].chapterInfo.filter((c) => c.id !== chapter.id);
          if (updated[id].chapterInfo.length === 0) delete updated[id];
        }
      }
      try { localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const addToBookMarks = (manga) => {
    setBookMarks((prev) => {
      const existing = prev.find((b) => b.manga.id === manga.id);
      let updated;
      if (existing) updated = prev.map((b) => (b.manga.id === manga.id ? { manga, bookmarkedAt: new Date() } : b));
      else updated = [{ manga, bookmarkedAt: new Date() }, ...prev].slice(0, 50);
      try { localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const removeFromBookMarks = (mangaId) => {
    setBookMarks((prev) => {
      const updated = prev.filter((b) => b.manga.id !== mangaId);
      try { localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const value = {
    selectedManga,
    setSelectedManga,
    getSelectedManga: () => selectedManga,
    addToReadHistory,
    getAllFromReadHistory: () => readHistory,
    addToFavoriteChapter,
    getAllFromFavoriteChapter: () => favoriteChapters,
    setChapterListForManga,
    getChapterListForManga: (id) => chapterLists[id] || [],
    addToFavorite,
    getAllFavorites: () => favorites,
    addToBookMarks,
    removeFromBookMarks,
    getAllBookMarks: () => bookMarks,
  };

  return <MangaContext.Provider value={value}>{children}</MangaContext.Provider>;
}

export function useManga() {
  const ctx = useContext(MangaContext);
  if (!ctx) throw new Error('useManga must be used within a MangaProvider');
  return ctx;
}


