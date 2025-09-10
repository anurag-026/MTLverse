const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Manga endpoints
  async getMangas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/mangas${queryString ? `?${queryString}` : ''}`);
  }

  async getManga(id) {
    return this.request(`/mangas/${id}`);
  }

  async getMangaChapters(mangaId) {
    return this.request(`/mangas/${mangaId}/chapters`);
  }

  async getChapter(mangaId, chapterId) {
    return this.request(`/mangas/${mangaId}/chapters/${chapterId}`);
  }

  // Search endpoints
  async searchMangas(query, params = {}) {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    return this.request(`/search?${queryString}`);
  }

  // User endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getFavorites() {
    return this.request('/user/favorites');
  }

  async addToFavorites(mangaId) {
    return this.request(`/user/favorites/${mangaId}`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(mangaId) {
    return this.request(`/user/favorites/${mangaId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiClient();
