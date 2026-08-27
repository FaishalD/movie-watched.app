type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  user_rating: number;
  watched_date: string;
};

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  if (!movies.length) {
    return (
      <div className="py-20 text-center text-gray-500">
        Belum ada film yang dicatat.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {movies.map((movie) => (
        <article key={movie.id} className="group">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-200">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Poster
              </div>
            )}

            <div className="absolute right-2 top-2 rounded-md bg-[#0B132B]/90 px-2 py-1 text-sm font-bold text-[#D4AF37]">
              ★ {movie.user_rating}
            </div>
          </div>

          <h3 className="mt-2 truncate font-semibold text-[#0B132B]">
            {movie.title}
          </h3>

          <p className="text-xs text-gray-500">Watched {movie.watched_date}</p>
        </article>
      ))}
    </div>
  );
}
