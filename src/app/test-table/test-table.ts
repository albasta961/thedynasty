import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-test-table',
  imports: [],
  templateUrl: './test-table.html',
  styleUrl: './test-table.css',
})
export class TestTable {
  private readonly http = inject(HttpClient);
  private readonly tightColumns = ['rank', 'team'];
  private readonly highlightedRowMarker = 'Week 6';
  private readonly lossMarker = '| l';
  private readonly winMarker = '| w';
  private readonly byeMarker = 'bye';
  private readonly imagePattern =
    /^(data:image\/[a-zA-Z+.-]+;base64,|https?:\/\/\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$|\/\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$|\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$)/i;

  readonly csvFilePath = input.required<string>();

  readonly headers = signal<string[]>([]);
  readonly rows = signal<string[][]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    effect(() => {
      void this.loadCsv(this.csvFilePath());
    });
  }

  private async loadCsv(csvFilePath: string): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.headers.set([]);
    this.rows.set([]);

    try {
      const csvText = await firstValueFrom(
        this.http.get(csvFilePath, { responseType: 'text' })
      );

      const parsedRows = this.parseCsv(csvText ?? '');

      if (parsedRows.length === 0) {
        this.error.set('No CSV data found.');
        return;
      }

      this.headers.set(parsedRows[0]);
      this.rows.set(parsedRows.slice(1));
    } catch {
      this.error.set('Unable to load CSV file.');
    } finally {
      this.loading.set(false);
    }
  }

  private parseCsv(csvText: string): string[][] {
    return csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.split(',').map((value) => value.trim()));
  }

  isImageCell(value: string): boolean {
    return this.imagePattern.test(value);
  }

  isTightColumn(header: string | undefined): boolean {
    return this.tightColumns.includes((header ?? '').trim().toLowerCase());
  }

  getCellResultClass(value: string): string {
    const normalizedValue = value.toLowerCase();

    if (normalizedValue.includes(this.lossMarker)) {
      return 'loss-cell';
    }

    if (normalizedValue.includes(this.winMarker)) {
      return 'win-cell';
    }

    if (normalizedValue.includes(this.byeMarker)) {
      return 'bye-cell';
    }

    return '';
  }

  isHighlightedRow(row: string[]): boolean {
    return row.some((cell) => cell.includes(this.highlightedRowMarker));
  }
}
