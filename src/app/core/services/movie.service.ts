import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { GhibliFilm, Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http.get<GhibliFilm[]>('https://ghibliapi.vercel.app/films').pipe(
      timeout(15000),
      map((films) =>
        films.map((film) => ({
          id: film.id,
          title: film.title,
          originalTitle: film.original_title,
          poster: film.image,
          director: film.director,
          releaseYear: Number(film.release_date),
          rating: Number(film.rt_score),
          duration: Number(film.running_time),
        })),
      ),
    );
  }
}
