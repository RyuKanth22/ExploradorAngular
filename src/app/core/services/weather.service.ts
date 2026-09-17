import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { CITIES } from '../data/cities';
import { CityWeather, ForecastResponse } from '../models/weather';

export function describeWeather(
  code: number | null,
  isDay: boolean,
): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Despejado', icon: isDay ? '☀' : '☾' };
  if (code === 1 || code === 2) return { condition: 'Parcialmente nublado', icon: '⛅' };
  if (code === 3) return { condition: 'Nublado', icon: '☁' };
  if (code === 45 || code === 48) return { condition: 'Niebla', icon: '≋' };
  if ([51, 53, 55, 56, 57].includes(code ?? -1)) return { condition: 'Llovizna', icon: '☂' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code ?? -1))
    return { condition: 'Lluvia', icon: '☂' };
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return { condition: 'Nieve', icon: '❄' };
  if ([95, 96, 99].includes(code ?? -1)) return { condition: 'Tormenta', icon: 'ϟ' };
  return { condition: 'Sin información', icon: '—' };
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  getWeather(): Observable<CityWeather[]> {
    // Open-Meteo devuelve las ubicaciones en el orden de las coordenadas solicitadas.
    return this.http
      .get<ForecastResponse[]>('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: CITIES.map((city) => city.latitude).join(','),
          longitude: CITIES.map((city) => city.longitude).join(','),
          current: 'temperature_2m,weather_code,is_day',
          timezone: 'auto',
        },
      })
      .pipe(
        timeout(15000),
        map((forecasts) => {
          if (forecasts.length !== CITIES.length) throw new Error('Respuesta de clima incompleta');
          return forecasts.map((forecast, index) => ({
            ...CITIES[index],
            temperature: forecast.current.temperature_2m,
            localTime: forecast.current.time,
            ...describeWeather(forecast.current.weather_code, forecast.current.is_day === 1),
          }));
        }),
      );
  }
}
