export default function MangaDetail({ params }) {
  const { mangaId } = params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manga Detail - {mangaId}</h1>
      <p>Manga detail page content will go here</p>
    </div>
  );
}
