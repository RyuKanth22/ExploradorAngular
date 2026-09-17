export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface ForecastResponse {
  current: {
    temperature_2m: number | null;
    weather_code: number | null;
    is_day: number;
    time: string;
  };
}

export interface CityWeather extends City {
  temperature: number | null;
  condition: string;
  icon: string;
  localTime: string;
}
