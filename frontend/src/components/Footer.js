export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MangaVerse</h3>
            <p className="text-gray-400">Your ultimate manga reading experience</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Browse</h4>
            <ul className="space-y-2">
              <li><a href="/search" className="text-gray-400 hover:text-white">Search</a></li>
              <li><a href="/favorites" className="text-gray-400 hover:text-white">Favorites</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li><a href="/login" className="text-gray-400 hover:text-white">Login</a></li>
              <li><a href="/register" className="text-gray-400 hover:text-white">Register</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MangaVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
