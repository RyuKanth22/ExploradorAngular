import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CITIES } from '../data/cities';
import { CityWeather } from '../models/weather';
import { describeWeather, WeatherService } from './weather.service';

describe('WeatherService', () => {
  let http: HttpTestingController;
  let service: WeatherService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });
  afterEach(() => http.verify());

  it('solicita las ciudades en un solo GET y conserva su correspondencia', () => {
    let result: CityWeather[] = [];
    service.getWeather().subscribe((cities) => (result = cities));
    const request = http.expectOne((req) => req.url === 'https://api.open-meteo.com/v1/forecast');
    expect(request.request.params.get('latitude')?.split(',')).toHaveLength(CITIES.length);
    expect(request.request.params.get('timezone')).toBe('auto');
    request.flush(
      CITIES.map((_, i) => ({
        current: { temperature_2m: 10 + i, weather_code: 3, is_day: 1, time: '2026-09-17T10:00' },
      })),
    );
    expect(result[0].name).toBe('Bogotá');
    expect(result[11].name).toBe('Tokio');
    expect(result[11].temperature).toBe(21);
    expect(result[0].condition).toBe('Nublado');
  });

  it('rechaza una respuesta incompleta en lugar de asignar ciudades equivocadas', () => {
    let failed = false;
    service.getWeather().subscribe({ error: () => (failed = true) });
    http.expectOne((req) => req.url.includes('/forecast')).flush([]);
    expect(failed).toBe(true);
  });

  it('distingue día, noche, lluvia y códigos sin información', () => {
    expect(describeWeather(0, true).icon).toBe('☀');
    expect(describeWeather(0, false).icon).toBe('☾');
    expect(describeWeather(63, true).condition).toBe('Lluvia');
    expect(describeWeather(null, true).condition).toBe('Sin información');
  });
});
