import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeContext';
import { PreferencesProvider } from './providers/PreferencesContext';
import { MangaProvider } from './providers/MangaContext';
import TopNavbar from './components/TopNavbar';

function Placeholder({ title }) {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<h1 className="text-2xl font-bold">{title}</h1>
		</div>
	);
}

// Map Next.js pages to React components
import Home from './page.jsx';
import MangaList from './(core)/manga-list/page.jsx';
import LibraryPage from './(core)/library/page.jsx';
import SearchPage from './(core)/search/page.jsx';
import MangaChapters from './(core)/manga/[mangaId]/chapters/page.jsx';
import ReadChapter from './(core)/manga/[mangaId]/chapter/[chapterId]/read/page.jsx';

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<PreferencesProvider>
					<MangaProvider>
						<TopNavbar />
						<Routes>
							{/* Home */}
							<Route path="/" element={<Home />} />
							{/* Manga List */}
							<Route path="/manga-list" element={<MangaList />} />
							{/* Library */}
							<Route path="/library" element={<LibraryPage />} />
							{/* Search */}
							<Route path="/search" element={<SearchPage />} />
							{/* Chapters listing for a manga */}
							<Route path="/manga/:mangaId/chapters" element={<MangaChapters />} />
							{/* Read a specific chapter */}
							<Route path="/manga/:mangaId/chapter/:chapterId/read" element={<ReadChapter />} />
							{/* Fallback */}
							<Route path="*" element={<Placeholder title="Not Found" />} />
						</Routes>
					</MangaProvider>
				</PreferencesProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
