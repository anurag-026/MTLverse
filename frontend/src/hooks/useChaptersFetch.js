// hooks/useChaptersFetch.js
import { useQuery } from '@tanstack/react-query';
import { getFromStorage, saveToStorage } from '../util/MangaList/cache';

export const fetchChapters = async (mangaId) => {
  const cacheKey = `chapters_${mangaId}`;
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for chapters of manga ${mangaId}`);
    return cachedData;
  }

  console.log(`Fetching fresh chapters for manga ${mangaId}`);
  
  // Import mangaApi dynamically to avoid circular dependencies
  const { default: mangaApi } = await import('../services/mangaApi');
  const data = await mangaApi.getMangaChapters(mangaId);
  
  if (!data.success) {
    throw new Error(data.error || `Failed to fetch chapters for manga ${mangaId}`);
  }
  
  saveToStorage(cacheKey, data.data);
  return data.data;
};

export const useChaptersFetch = (mangaId) => {
  return useQuery({
    queryKey: ['chapters', mangaId],
    queryFn: () => fetchChapters(mangaId),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false,
    enabled: !!mangaId,
  });
};