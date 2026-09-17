import { ChangeDetectionStrategy, Component, Input, signal, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Dataset, ExplorerRow, normalizeSearch } from './explorer-row';
import { spanishPaginator } from './paginator-intl';

@Component({
  selector: 'app-data-table',
  providers: [{ provide: MatPaginatorIntl, useFactory: spanishPaginator }],
  imports: [
    DecimalPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable {
  @Input({ required: true }) dataset: Dataset = 'movies';
  @Input({ required: true }) set rows(rows: ExplorerRow[]) {
    this.dataSource.data = rows;
    this.dataSource.paginator?.firstPage();
  }
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  readonly dataSource = new MatTableDataSource<ExplorerRow>([]);
  readonly query = signal('');
  readonly failedImages = signal<ReadonlySet<string>>(new Set());

  constructor() {
    this.dataSource.filterPredicate = (row, filter) => normalizeSearch(row.name).includes(filter);
  }

  get columns(): string[] {
    return this.dataset === 'movies'
      ? ['name', 'year', 'director', 'duration', 'rating']
      : ['name', 'temperature', 'condition', 'localTime'];
  }

  filter(value: string): void {
    this.query.set(value);
    this.dataSource.filter = normalizeSearch(value);
    this.dataSource.paginator?.firstPage();
  }

  imageFailed(id: string): void {
    this.failedImages.update((current) => new Set([...current, id]));
  }
}
