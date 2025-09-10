import MangaList from '../components/MangaList';

// Sample data - in a real app, this would come from an API
const sampleMangas = [
  {
    id: 1,
    title: "One Piece",
    author: "Eiichiro Oda",
    coverImage: "/images/one-piece.jpg",
    status: "Ongoing",
    chapterCount: 1095
  },
  {
    id: 2,
    title: "Naruto",
    author: "Masashi Kishimoto",
    coverImage: "/images/naruto.jpg",
    status: "Completed",
    chapterCount: 700
  },
  {
    id: 3,
    title: "Attack on Titan",
    author: "Hajime Isayama",
    coverImage: "/images/aot.jpg",
    status: "Completed",
    chapterCount: 139
  },
  {
    id: 4,
    title: "Demon Slayer",
    author: "Koyoharu Gotouge",
    coverImage: "/images/demon-slayer.jpg",
    status: "Completed",
    chapterCount: 205
  },
  {
    id: 5,
    title: "My Hero Academia",
    author: "Kohei Horikoshi",
    coverImage: "/images/mha.jpg",
    status: "Ongoing",
    chapterCount: 400
  },
  {
    id: 6,
    title: "Jujutsu Kaisen",
    author: "Gege Akutami",
    coverImage: "/images/jjk.jpg",
    status: "Ongoing",
    chapterCount: 250
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to MangaVerse
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover and read thousands of manga titles with the best reading experience
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/search"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Manga
          </a>
          <a
            href="/register"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Featured Manga Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Manga</h2>
        <MangaList mangas={sampleMangas} />
      </section>

      {/* Popular Genres */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Horror'].map((genre) => (
            <a
              key={genre}
              href={`/search?genre=${genre.toLowerCase()}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              {genre}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
