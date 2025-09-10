// MangaDex API Service for React
import axios from 'axios';

// Configuration constants
const CONFIG = {
  baseUrl: 'https://api.mangadex.org',
  fetchLimit: 100,
  resultLimit: 50,
  includes: ['cover_art', 'author', 'artist', 'creator'],
};

// Helper function to process manga items
function processMangaItem(manga) {
  const { id, attributes, relationships } = manga;
  const {
    title = {},
    altTitles = [],
    description = {},
    contentRating = 'N/A',
    status = 'Unknown',
    year = 'N/A',
    updatedAt,
    tags = [],
    publicationDemographic,
    links = {},
    availableTranslatedLanguages = [],
    latestUploadedChapter,
    originalLanguage
  } = attributes;

  // Process relationships in single pass
  const groupedRelationships = relationships.reduce((acc, rel) => {
    (acc[rel.type] = acc[rel.type] || []).push(rel);
    return acc;
  }, {});

  // Process cover art
  const coverArt = groupedRelationships.cover_art?.[0]?.attributes?.fileName;
  const coverImageUrl = coverArt ? `https://mangadex.org/covers/${id}/${coverArt}.256.jpg` : '';

  // Process tags in single pass
  const { groupedTags, flatTags } = tags.reduce((acc, tag) => {
    const group = tag.attributes?.group || 'Unknown Group';
    const tagName = tag.attributes?.name?.en || 'Unknown Tag';
    acc.groupedTags[group] = acc.groupedTags[group] || [];
    acc.groupedTags[group].push(tagName);
    acc.flatTags.push(tagName);
    return acc;
  }, { groupedTags: {}, flatTags: [] });

  return {
    id,
    title: title.en || Object.values(altTitles[0] || {})[0] || 'Untitled',
    description: description.en || 'No description available.',
    altTitle: Object.values(altTitles[0] || { none: 'N/A' })[0] || 'N/A',
    contentRating,
    status,
    altTitles,
    year,
    updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
    tags: Object.entries(groupedTags).map(([group, tags]) => ({ group, tags })),
    flatTags,
    coverImageUrl,
    authorName: groupedRelationships.author,
    artistName: groupedRelationships.artist,
    creatorName: groupedRelationships.creator || 'N/A',
    MangaStoryType: publicationDemographic,
    availableTranslatedLanguages,
    latestUploadedChapter,
    originalLanguage,
    type: manga.type,
    links,
  };
}

// Helper function to add ratings to manga
async function addRatingsToManga(mangaList) {
  if (!mangaList || mangaList.length === 0) return mangaList;
  
  try {
    const mangaIds = mangaList.map(manga => manga.id);
    const statsResponse = await axios.get(`${CONFIG.baseUrl}/statistics/manga`, {
      params: { 'manga[]': mangaIds }
    });

    return mangaList.map(manga => ({
      ...manga,
      rating: statsResponse.data.statistics?.[manga.id] || {}
    }));
  } catch (error) {
    console.warn('Failed to fetch ratings:', error.message);
    return mangaList;
  }
}

// API Service Functions
export const mangaApi = {
  // Get latest manga
  async getLatest() {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
        params: {
          limit: CONFIG.fetchLimit,
          includes: CONFIG.includes,
          order: { updatedAt: 'desc' },
        },
      });

      const mangaList = response.data.data || [];
      const validManga = mangaList
        .filter(manga => (
          manga.attributes.latestUploadedChapter !== null &&
          manga.relationships?.some(rel => rel.type === 'cover_art')
        ))
        .slice(0, CONFIG.resultLimit)
        .map(processMangaItem);

      const mangaWithRatings = await addRatingsToManga(validManga);
      
      return {
        data: mangaWithRatings,
        total: mangaWithRatings.length,
        success: true
      };
    } catch (error) {
      console.error('Error fetching latest manga:', error);
      return {
        data: [],
        error: error.message || 'Failed to fetch latest manga',
        success: false
      };
    }
  },

  // Get random manga
  async getRandom() {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
        params: {
          limit: CONFIG.fetchLimit,
          includes: CONFIG.includes,
        },
      });

      const mangaList = response.data.data || [];
      const validManga = mangaList
        .filter(manga => (
          manga.attributes.latestUploadedChapter !== null &&
          manga.relationships?.some(rel => rel.type === 'cover_art')
        ))
        .map(processMangaItem);

      // Get random subset
      const shuffled = [...validManga];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const randomManga = shuffled.slice(0, 10);
      const mangaWithRatings = await addRatingsToManga(randomManga);
      
      return {
        data: mangaWithRatings,
        success: true
      };
    } catch (error) {
      console.error('Error fetching random manga:', error);
      return {
        data: [],
        error: error.message || 'Failed to fetch random manga',
        success: false
      };
    }
  },

  // Search manga by title
  async searchTitles(title) {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
        params: {
          title: title || "",
          limit: CONFIG.fetchLimit,
          includes: CONFIG.includes,
        },
      });

      const mangaList = response.data.data || [];
      const validManga = mangaList
        .filter(manga => (
          manga.attributes.latestUploadedChapter !== null &&
          manga.relationships?.some(rel => rel.type === 'cover_art')
        ))
        .map(processMangaItem);

      const mangaWithRatings = await addRatingsToManga(validManga);
      
      return {
        data: mangaWithRatings,
        success: true
      };
    } catch (error) {
      console.error('Error searching manga:', error);
      return {
        data: [],
        error: error.message || 'Failed to search manga',
        success: false
      };
    }
  },

  // Get top-rated manga
  async getTopRated() {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
        params: {
          limit: CONFIG.fetchLimit,
          includes: CONFIG.includes,
          order: { rating: 'desc' },
        },
      });

      const mangaList = response.data.data || [];
      const validManga = mangaList
        .filter(manga => (
          manga.attributes.latestUploadedChapter !== null &&
          manga.relationships?.some(rel => rel.type === 'cover_art')
        ))
        .slice(0, 20)
        .map(processMangaItem);

      const mangaWithRatings = await addRatingsToManga(validManga);
      
      return {
        data: mangaWithRatings,
        total: validManga.length,
        success: true
      };
    } catch (error) {
      console.error('Error fetching top-rated manga:', error);
      return {
        data: [],
        error: error.message || 'Failed to fetch top-rated manga',
        success: false
      };
    }
  },

  // Get manga by ID
  async getMangaById(mangaId) {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga/${mangaId}`, {
        params: {
          includes: CONFIG.includes,
        },
      });

      const manga = response.data.data;
      if (!manga) {
        throw new Error('Manga not found');
      }

      const processedManga = processMangaItem(manga);
      const mangaWithRatings = await addRatingsToManga([processedManga]);
      
      return {
        data: mangaWithRatings[0],
        success: true
      };
    } catch (error) {
      console.error('Error fetching manga by ID:', error);
      return {
        data: null,
        error: error.message || 'Failed to fetch manga',
        success: false
      };
    }
  },

  // Get chapters for a manga
  async getMangaChapters(mangaId) {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga/${mangaId}/feed`, {
        params: {
          limit: 500,
          includes: ['scanlation_group', 'user'],
          order: { chapter: 'asc' },
        },
      });

      const chapters = response.data.data || [];
      const processedChapters = chapters.map(chapter => ({
        id: chapter.id,
        chapter: chapter.attributes.chapter,
        title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`,
        translatedLanguage: chapter.attributes.translatedLanguage,
        pages: chapter.attributes.pages,
        publishAt: chapter.attributes.publishAt,
        readAt: chapter.attributes.readAt,
        createdAt: chapter.attributes.createdAt,
        updatedAt: chapter.attributes.updatedAt,
        version: chapter.attributes.version,
        volume: chapter.attributes.volume,
        externalUrl: chapter.attributes.externalUrl,
        scanlationGroups: chapter.relationships
          ?.filter(rel => rel.type === 'scanlation_group')
          ?.map(rel => rel.attributes?.name || 'Unknown Group') || [],
      }));

      return {
        data: processedChapters,
        success: true
      };
    } catch (error) {
      console.error('Error fetching manga chapters:', error);
      return {
        data: [],
        error: error.message || 'Failed to fetch chapters',
        success: false
      };
    }
  },

  // Get chapter pages
  async getChapterPages(chapterId) {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/at-home/server/${chapterId}`);
      const { baseUrl, chapter } = response.data;

      // Return the data in the format the component expects
      const pages = chapter.data.map((page, index) => 
        `${baseUrl}/data/${chapter.hash}/${page}`
      );

      // Return in the structure expected by MiddleImageAndOptions component
      return {
        data: {
          chapter: {
            data: pages,
            dataSaver: pages, // For now, same as data
            hash: chapter.hash
          }
        },
        success: true
      };
    } catch (error) {
      console.error('Error fetching chapter pages:', error);
      return {
        data: {
          chapter: {
            data: [],
            dataSaver: []
          }
        },
        error: error.message || 'Failed to fetch chapter pages',
        success: false
      };
    }
  },

  // Get latest arrivals
  async getLatestArrivals() {
    try {
      const response = await axios.get(`${CONFIG.baseUrl}/manga`, {
        params: {
          limit: CONFIG.fetchLimit,
          includes: CONFIG.includes,
          order: { createdAt: 'desc' },
        },
      });

      const mangaList = response.data.data || [];
      const validManga = mangaList
        .filter(manga => (
          manga.attributes.latestUploadedChapter !== null &&
          manga.relationships?.some(rel => rel.type === 'cover_art')
        ))
        .slice(0, 20)
        .map(processMangaItem);

      const mangaWithRatings = await addRatingsToManga(validManga);
      
      return {
        data: mangaWithRatings,
        success: true
      };
    } catch (error) {
      console.error('Error fetching latest arrivals:', error);
      return {
        data: [],
        error: error.message || 'Failed to fetch latest arrivals',
        success: false
      };
    }
  },

  // Get favorite manga (placeholder - would need user authentication)
  async getFavorites() {
    // This would require user authentication with MangaDex
    // For now, return empty array
    return {
      data: [],
      success: true
    };
  }
};

export default mangaApi;
