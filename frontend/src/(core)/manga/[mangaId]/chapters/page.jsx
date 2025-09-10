'use client';

import { useParams, Link } from 'react-router-dom';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useManga } from '../../../../providers/MangaContext';
import AboutManga from '../../../../Components/MangaChaptersComponents/AboutManga';
import TabsAndSections from '../../../../Components/MangaChaptersComponents/TabsAndSections';
import AboutMangaSkeleton from '../../../../Components/Skeletons/MangaChapters/AboutMangaSkeleton';
import TabsAndSectionsSkeleton from '../../../../Components/Skeletons/MangaChapters/TabsAndSectionsSkeleton';
import { useChaptersFetch } from '../../../../hooks/useChaptersFetch';
import { useTheme } from '@/app/providers/ThemeContext';
import mangaApi from '../../../../services/mangaApi';

export default function MangaChapters() {
  const { mangaId } = useParams();
  const { selectedManga, setSelectedManga, setChapterListForManga, addToReadHistory } = useManga();
  const [isClient, setIsClient] = useState(false);
  const [mangaData, setMangaData] = useState(null);
  const [mangaLoading, setMangaLoading] = useState(false);
  const [mangaError, setMangaError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch manga data if not available
  useEffect(() => {
    const fetchMangaData = async () => {
      if (!mangaId) return;
      
      // Check if we already have the manga data
      if (selectedManga && selectedManga.id === mangaId) {
        setMangaData(selectedManga);
        return;
      }

      setMangaLoading(true);
      setMangaError(null);
      
      try {
        const result = await mangaApi.getMangaById(mangaId);
        if (result.success && result.data) {
          setMangaData(result.data);
          setSelectedManga(result.data); // Store in context for future use
        } else {
          setMangaError(result.error || 'Failed to fetch manga data');
        }
      } catch (error) {
        setMangaError(error.message || 'Failed to fetch manga data');
      } finally {
        setMangaLoading(false);
      }
    };

    fetchMangaData();
  }, [mangaId, selectedManga, setSelectedManga]);

  const manga = useMemo(
    () => mangaData || (selectedManga && selectedManga.id === mangaId ? selectedManga : null),
    [mangaData, selectedManga, mangaId]
  );

  const {
    data: chapters = [],
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useChaptersFetch(mangaId);

  const handleChapterClick = useCallback(
    (chapter) => {
      if (!chapter?.id) {
        console.error('Invalid chapter ID:', chapter);
        return;
      }
      setChapterListForManga(mangaId, chapters);
      addToReadHistory(manga, chapter, chapters);
    },
    [mangaId, chapters, manga, setChapterListForManga, addToReadHistory]
  );

  if (mangaError) {
    return (
      <div className="flex justify-center items-center w-full h-[79vh] bg-black/10 backdrop-blur-md text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{mangaError}</p>
          <p className="text-sm text-gray-400">
            Please{' '}
            <Link
              to={"/"}
              className="text-blue-400 underline hover:text-blue-600"
            >
              go back
            </Link>{' '}
            or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (chaptersError) {
    return (
      <div className="flex justify-center items-center w-full h-[79vh] bg-black/10 backdrop-blur-md text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{chaptersError?.message ?? 'Failed to load chapters.'}</p>
          <p className="text-sm text-gray-400">
            Please{' '}
            <Link
              to={"/"}
              className="text-blue-400 underline hover:text-blue-600"
            >
              go back
            </Link>{' '}
            or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!isClient || mangaLoading || !manga) {
    return (
      <div className="w-full min-h-screen -mt-7 md:-mt-20 overflow-hidden bg-transparent flex flex-col gap-12 text-white">
        <AboutMangaSkeleton isDark={isDark} />
        <TabsAndSectionsSkeleton isDark={isDark} />
      </div>
    );
  }

  return (
    <div className="w-full relative z-20 min-h-screen -mt-20 overflow-hidden bg-transparent flex flex-col gap-12 text-white">
      <AboutManga isDark={isDark} chapters={chapters} manga={manga} handleChapterClick={handleChapterClick} />
      {chaptersLoading ? (
        <TabsAndSectionsSkeleton isDark={isDark} />
      ) : chapters.length === 0 ? (
        <div className="text-center flex justify-center items-center font-bold text-red-500 text-lg bg-[#070920] backdrop-blur-md w-full h-[88vh]">
          No chapters found for this manga.
        </div>
      ) : (
        <TabsAndSections isDark={isDark} chapters={chapters} manga={manga} handleChapterClick={handleChapterClick} />
      )}
    </div>
  );
}