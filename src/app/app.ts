import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestTable } from './test-table/test-table';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TestTable],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dynasty-v1');
}
