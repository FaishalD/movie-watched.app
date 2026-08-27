import SearchModal from "@/components/SearchModal";
import MovieGrid from "@/components/MovieGrid";
import { getWatchedMovies } from "./actions";
import { supabase } from "../lib/Supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const movies = await getWatchedMovies();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-[#0B132B] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Personal <span className="text-[#D4AF37]">Movie Log</span>
            </h1>
            <p className="text-sm text-gray-300">
              Every movie has a story. Keep yours.
            </p>
          </div>

          <SearchModal />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0B132B]">Watched Movies</h2>
          <p className="text-sm text-gray-500">
            {movies.length} movie{movies.length !== 1 ? "s" : ""} logged
          </p>
        </div>

        <MovieGrid movies={movies} />
      </section>
    </main>
  );
}

export async function getWatchedMovies() {
  try {
    const { data, error } = await supabase
      .from("watched_movies")
      .select("*")
      .order("watched_date", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Fetch Exception:", err);
    return []; // Return array kosong jika fetch gagal saat build
  }
}
