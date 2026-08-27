"use client";

import { useEffect, useState } from "react";
import { addMovie, searchTMDB } from "@/app/actions";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

export default function SearchModal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState("8");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Set tanggal bawaan hanya di sisi Client untuk menghindari Hydration Error
  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await searchTMDB(query);
        setResults(res || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      await addMovie(formData);
      setSelected(null);
      setQuery("");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to add movie:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-[#D4AF37] px-5 py-2.5 font-semibold text-[#0B132B] hover:opacity-90"
      >
        + Add Movie
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B132B]">
                {selected ? "Log Movie" : "Search Movie"}
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-xl text-gray-500"
              >
                ×
              </button>
            </div>

            {!selected ? (
              <>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movie..."
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 placeholder-gray-400 outline-none focus:border-[#D4AF37] focus:text-slate-900 focus:bg-white"
                />

                <div className="mt-3 max-h-80 overflow-y-auto">
                  {loading && (
                    <p className="p-3 text-sm text-gray-500">Searching...</p>
                  )}

                  {results.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => setSelected(movie)}
                      className="flex w-full gap-3 rounded-lg p-3 text-left hover:bg-gray-100"
                    >
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          className="h-16 w-11 rounded object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="h-16 w-11 rounded bg-gray-200" />
                      )}

                      <div>
                        <p className="font-semibold text-[#0B132B]">
                          {movie.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {movie.release_date?.slice(0, 4) || "Unknown"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="tmdb_id" value={selected.id} />
                <input type="hidden" name="title" value={selected.title} />
                <input
                  type="hidden"
                  name="poster_path"
                  value={selected.poster_path || ""}
                />
                <input
                  type="hidden"
                  name="release_date"
                  value={selected.release_date || ""}
                />

                <div className="flex gap-4">
                  {selected.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${selected.poster_path}`}
                      className="h-32 w-22 rounded-lg object-cover"
                      alt={selected.title}
                    />
                  )}

                  <div>
                    <h3 className="font-bold text-[#0B132B]">
                      {selected.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selected.release_date?.slice(0, 4)}
                    </p>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm text-slate-900 font-medium">
                    My Rating
                  </span>
                  <input
                    type="number"
                    name="user_rating"
                    min="1"
                    max="10"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 outline-none focus:border-[#D4AF37]"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-slate-900 font-medium">
                    Watched Date
                  </span>
                  <input
                    type="date"
                    name="watched_date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 outline-none focus:border-[#D4AF37]"
                    required
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="flex-1 rounded-lg border px-4 py-3"
                  >
                    Back
                  </button>

                  <button
                    disabled={loading}
                    className="flex-1 rounded-lg bg-[#0B132B] px-4 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Movie"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
