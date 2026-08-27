"use server";

import { supabase } from "@/lib/Supabase";

const TMDB_URL = "https://api.themoviedb.org/3";

export async function searchTMDB(query: string) {
  if (!query?.trim()) return [];

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB_API_KEY is missing in environment variables.");
    return [];
  }

  try {
    const res = await fetch(
      `${TMDB_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) {
      console.error("TMDB fetch status error:", res.status);
      return [];
    }

    const data = await res.json();
    return (
      data.results?.slice(0, 8).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      })) ?? []
    );
  } catch (err) {
    console.error("Exception in searchTMDB:", err);
    return [];
  }
}

export async function addMovie(formData: FormData) {
  try {
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

    if (error) {
      console.error("Supabase insert error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in addMovie:", err);
    return { success: false, error: "Failed to add movie" };
  }
}

export async function getWatchedMovies() {
  try {
    const { data, error } = await supabase
      .from("watched_movies")
      .select("*")
      .order("watched_date", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Exception in getWatchedMovies:", err);
    return [];
  }
}
