// hooks/useMangaFetch.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import mangaApi from '../services/mangaApi';
import {
  getFromStorage,
  getRawFromStorage,
  saveToStorage,
  markAsFailed,
  clearFailure,
} from '../util/MangaList/cache';

const buildCacheKey = (type, page) => `manga_${type}_${page}`;

export const fetchMangaType = async (type, page) => {
  const cacheKey = buildCacheKey(type, page);

  // Quick-return if cached and ok
  const cached = getFromStorage(cacheKey);
  if (cached) return cached;

  // If raw exists but ok === false, we'll still fetch and overwrite
  // Do the network request using the new API service
  try {
    let data;
    
    switch (type) {
      case 'latest':
        data = await mangaApi.getLatest();
        break;
      case 'random':
        data = await mangaApi.getRandom();
        break;
      case 'rating':
        data = await mangaApi.getTopRated();
        break;
      case 'latestArrivals':
        data = await mangaApi.getLatestArrivals();
        break;
      case 'favourite':
        data = await mangaApi.getFavorites();
        break;
      default:
        throw new Error(`Unknown manga type: ${type}`);
    }

    if (!data.success) {
      markAsFailed(cacheKey, data.error);
      throw new Error(data.error);
    }

    saveToStorage(cacheKey, data);
    return data;
  } catch (err) {
    // Network / other error: mark tainted and rethrow
    markAsFailed(cacheKey, err);
    throw err;
  }
};

export const useMangaFetch = (type, page) => {
  const queryClient = useQueryClient();
  const cacheKey = buildCacheKey(type, page);

  const q = useQuery({
    queryKey: ['manga', type, page],
    queryFn: () => fetchMangaType(type, page),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    suspense: false,
    onError: (err) => {
      // Ensure storage is marked failed (defensive)
      markAsFailed(cacheKey, err);
    },
    onSuccess: (data) => {
      // Save latest and clear any failure state
      clearFailure(cacheKey, data);
    },
  });

  useEffect(() => {
    // If the stored raw entry is tainted, invalidate so react-query
    // picks up fresh data (or triggers retry according to retry policy).
    const raw = getRawFromStorage(cacheKey);
    if (!raw || raw.ok === false) {
      queryClient.invalidateQueries(['manga', type, page]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page, queryClient]);

  return q;
};