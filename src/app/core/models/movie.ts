export interface GhibliFilm {
  id: string;
  title: string;
  original_title: string;
  image: string;
  director: string;
  release_date: string;
  rt_score: string;
  running_time: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  poster: string;
  director: string;
  releaseYear: number;
  rating: number;
  duration: number;
}
