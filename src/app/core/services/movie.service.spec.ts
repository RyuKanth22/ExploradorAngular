import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie';

describe('MovieService', () => {
  let http: HttpTestingController;
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MovieService);
  });
  afterEach(() => http.verify());

  it('consulta con GET y convierte los valores numéricos del proveedor', () => {
    let result: Movie | undefined;
    service.getMovies().subscribe((movies) => (result = movies[0]));
    const request = http.expectOne('https://ghibliapi.vercel.app/films');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: '1',
        title: 'Totoro',
        original_title: 'となりのトトロ',
        image: 'poster.jpg',
        director: 'Hayao Miyazaki',
        release_date: '1988',
        rt_score: '93',
        running_time: '86',
      },
    ]);
    expect(result).toEqual({
      id: '1',
      title: 'Totoro',
      originalTitle: 'となりのトトロ',
      poster: 'poster.jpg',
      director: 'Hayao Miyazaki',
      releaseYear: 1988,
      rating: 93,
      duration: 86,
    });
  });

  it('propaga el error HTTP para que la página muestre feedback', () => {
    let status = 0;
    service.getMovies().subscribe({ error: (error) => (status = error.status) });
    http
      .expectOne('https://ghibliapi.vercel.app/films')
      .flush('Error', { status: 503, statusText: 'Unavailable' });
    expect(status).toBe(503);
  });
});
