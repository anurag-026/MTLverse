// hooks/useChaptersFetch.js
import { useQuery } from '@tanstack/react-query';
import { getFromStorage, saveToStorage } from '../util/MangaList/cache';

export const fetchChapterpages = async (chapterId) => {
  const cacheKey = `chapter_${chapterId}`;
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for pages of chapter ${chapterId}`);
    return cachedData;
  }

  console.log(`Fetching fresh chapter pages for chapter ${chapterId}`);
  
  // Import mangaApi dynamically to avoid circular dependencies
  const { default: mangaApi } = await import('../services/mangaApi');
  const data = await mangaApi.getChapterPages(chapterId);
  
  if (!data.success) {
    throw new Error(data.error || `Failed to fetch pages for chapter ${chapterId}`);
  }
  
  saveToStorage(cacheKey, data.data);
  return data.data;
};

export const useChapterPagesFetch = (chapterId) => {
  return useQuery({
    queryKey: ['chapters', chapterId],
    queryFn: () => fetchChapterpages(chapterId),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false,
    enabled: !!chapterId,
  });
};