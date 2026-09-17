import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MovieService } from '../../core/services/movie.service';
import { WeatherService } from '../../core/services/weather.service';
import { ExplorePage } from './explore-page';

describe('ExplorePage', () => {
  it('muestra error y permite recuperarse con un nuevo intento', async () => {
    const getMovies = vi
      .fn()
      .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503 })));
    const open = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ExplorePage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { dataset: 'movies' } } } },
        { provide: MovieService, useValue: { getMovies } },
        { provide: WeatherService, useValue: {} },
        { provide: MatSnackBar, useValue: { open } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ExplorePage);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Volver a intentar');
    expect(open).toHaveBeenCalled();
    getMovies.mockReturnValue(of([]));
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBe('');
    expect(fixture.componentInstance.updatedAt()).not.toBeNull();
  });
});
