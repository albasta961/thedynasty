import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTable } from './test-table';

describe('TestTable', () => {
  let component: TestTable;
  let fixture: ComponentFixture<TestTable>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTable],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTable);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', async () => {
    fixture.componentRef.setInput('csvFilePath', 'sample-data/test-table.csv');
    fixture.detectChanges();

    const request = httpMock.expectOne('sample-data/test-table.csv');
    request.flush('Team,Wins,Losses\nLions,12,5');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.headers()).toEqual(['Team', 'Wins', 'Losses']);
    expect(component.rows()).toEqual([['Lions', '12', '5']]);
  });

  it('should render image cells as img elements', async () => {
    fixture.componentRef.setInput('csvFilePath', 'sample-data/test-table.csv');
    fixture.detectChanges();

    const request = httpMock.expectOne('sample-data/test-table.csv');
    request.flush('Team,Logo\nLions,sample-data/logos/lions.png');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('tbody img');

    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('sample-data/logos/lions.png');
    expect(image?.getAttribute('alt')).toBe('Logo');
  });

  it('should render image headers as img elements', async () => {
    fixture.componentRef.setInput('csvFilePath', 'sample-data/test-table.csv');
    fixture.detectChanges();

    const request = httpMock.expectOne('sample-data/test-table.csv');
    request.flush('Week,sample-data/logos/buffalo.png\nWeek 0,FIU');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('thead img');

    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('sample-data/logos/buffalo.png');
    expect(image?.getAttribute('alt')).toBe('Column 2');
  });

  it('should apply win and loss classes based on cell text', async () => {
    fixture.componentRef.setInput('csvFilePath', 'sample-data/test-table.csv');
    fixture.detectChanges();

    const request = httpMock.expectOne('sample-data/test-table.csv');
    request.flush('Team,Result\nLions,34-20 | W\nBears,17-24 | L');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const bodyCells = compiled.querySelectorAll('tbody td');

    expect(bodyCells[1]?.classList.contains('win-cell')).toBe(true);
    expect(bodyCells[3]?.classList.contains('loss-cell')).toBe(true);
  });

  it('should highlight rows containing the configured marker', async () => {
    fixture.componentRef.setInput('csvFilePath', 'sample-data/test-table.csv');
    fixture.detectChanges();

    const request = httpMock.expectOne('sample-data/test-table.csv');
    request.flush('Week,Opponent\nWeek 4,Rice\nWeek 5,Notre Dame');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');

    expect(rows[0]?.classList.contains('highlighted-row')).toBe(false);
    expect(rows[1]?.classList.contains('highlighted-row')).toBe(true);
  });
});
