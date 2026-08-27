"use server";

import { supabase } from "../lib/Supabase";

const TMDB_URL = "https://api.themoviedb.org/3";

export async function searchTMDB(query: string) {
  if (!query.trim()) return [];

  const res = await fetch(
    `${TMDB_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`,
    { next: { revalidate: 300 } },
  );

  if (!res.ok) throw new Error("TMDB request failed");

  const data = await res.json();

  return data.results.slice(0, 8).map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
  }));
}

export async function addMovie(formData: FormData) {
  const movie = {
    tmdb_id: Number(formData.get("tmdb_id")),
    title: String(formData.get("title")),
    poster_path: String(formData.get("poster_path") || ""),
    release_date: formData.get("release_date")
      ? String(formData.get("release_date"))
      : null,
    user_rating: Number(formData.get("user_rating")),
    watched_date: String(formData.get("watched_date")),
  };

  const { error } = await supabase.from("watched_movies").insert(movie);

  if (error) throw new Error(error.message);

  return { success: true };
}

export async function getWatchedMovies() {
  const { data, error } = await supabase
    .from("watched_movies")
    .select("*")
    .order("watched_date", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}
