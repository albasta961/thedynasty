import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let httpMock: HttpTestingController;

  function flushTableRequests(): void {
    httpMock.expectOne(
      (request) => request.url.startsWith('sample-data/2026 Records.csv?v=')
    ).flush(
      'Rank,Team,Wins\n1,Lions,12'
    );
    httpMock.expectOne(
      (request) => request.url.startsWith('sample-data/2026 Schedule v2.csv?v=')
    ).flush(
      'Week,Opponent\n1,Packers'
    );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    flushTableRequests();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    flushTableRequests();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img[alt=\"Dongs\"]')).not.toBeNull();
    expect(compiled.textContent).toContain('Week 8');
    expect(compiled.textContent).toContain('2026 Schedule');
  });
});
