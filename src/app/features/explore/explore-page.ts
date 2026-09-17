import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, TimeoutError } from 'rxjs';
import { MovieService } from '../../core/services/movie.service';
import { WeatherService } from '../../core/services/weather.service';
import { DataTable } from '../../shared/data-table/data-table';
import { Dataset, ExplorerRow } from '../../shared/data-table/explorer-row';

@Component({
  selector: 'app-explore-page',
  imports: [
    DatePipe,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    DataTable,
  ],
  templateUrl: './explore-page.html',
  styleUrl: './explore-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorePage {
  private readonly movieService = inject(MovieService);
  private readonly weatherService = inject(WeatherService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  readonly dataset: Dataset =
    inject(ActivatedRoute).snapshot.data['dataset'] === 'weather' ? 'weather' : 'movies';
  readonly rows = signal<ExplorerRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly updatedAt = signal<Date | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    const source: Observable<ExplorerRow[]> =
      this.dataset === 'movies'
        ? this.movieService.getMovies().pipe(
            map((movies) =>
              movies.map((movie) => ({
                id: movie.id,
                name: movie.title,
                subtitle: movie.originalTitle,
                image: movie.poster,
                year: movie.releaseYear,
                director: movie.director,
                rating: movie.rating,
                duration: movie.duration,
              })),
            ),
          )
        : this.weatherService.getWeather().pipe(
            map((cities) =>
              cities.map((city) => ({
                id: city.name,
                name: city.name,
                subtitle: city.country,
                icon: city.icon,
                temperature: city.temperature,
                condition: city.condition,
                localTime: city.localTime,
              })),
            ),
          );

    source.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (rows) => {
        const isRefresh = this.updatedAt() !== null;
        this.rows.set(rows);
        this.updatedAt.set(new Date());
        this.loading.set(false);
        if (isRefresh) this.snackbar.open('Datos actualizados', 'Cerrar', { duration: 3000 });
      },
      error: (error: unknown) => {
        const message =
          error instanceof TimeoutError
            ? 'La consulta tardó demasiado. Intenta nuevamente.'
            : error instanceof HttpErrorResponse && error.status === 0
              ? 'No pudimos conectar con la fuente. Revisa tu conexión e intenta nuevamente.'
              : 'La fuente de datos no está disponible en este momento. Intenta nuevamente.';
        this.error.set(message);
        this.loading.set(false);
        this.snackbar.open('No se pudieron cargar los datos', 'Cerrar', { duration: 5000 });
      },
    });
  }
}
