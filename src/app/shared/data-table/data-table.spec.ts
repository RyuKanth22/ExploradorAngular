import { TestBed } from '@angular/core/testing';
import { DataTable } from './data-table';
import { ExplorerRow } from './explorer-row';

describe('DataTable', () => {
  it('pagina, busca sin tildes y regresa a la primera página al filtrar', async () => {
    await TestBed.configureTestingModule({ imports: [DataTable] }).compileComponents();
    const fixture = TestBed.createComponent(DataTable);
    const rows: ExplorerRow[] = Array.from({ length: 12 }, (_, index) => ({
      id: String(index),
      name: index === 8 ? 'Bogotá' : `Ciudad ${index}`,
      subtitle: 'Colombia',
      temperature: 20,
      condition: 'Nublado',
      localTime: '2026-09-17T10:00',
    }));
    fixture.componentRef.setInput('dataset', 'weather');
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    await fixture.whenStable();
    const table = fixture.componentInstance;
    expect(table.dataSource.paginator?.pageSize).toBe(5);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('tr.mat-mdc-row')).toHaveLength(
      5,
    );
    table.dataSource.paginator?.nextPage();
    expect(table.dataSource.paginator?.pageIndex).toBe(1);
    table.filter('BOGOTA');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(table.dataSource.paginator?.pageIndex).toBe(0);
    expect(table.dataSource.filteredData.map((row) => row.name)).toEqual(['Bogotá']);
    table.filter('ninguna');
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'No encontramos coincidencias',
    );
  });
});
