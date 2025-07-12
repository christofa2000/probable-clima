import axios from "axios";
import { z } from "zod";
import { useState, useMemo } from "react";
import type { SearchType } from "../types";

// ✅ 1) Define tu esquema Zod completo (ajústalo si necesitas más campos)
const WeatherSchema = z.object({
  name: z.string(),
  sys: z.object({
    country: z.string(),
  }),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(
    z.object({
      description: z.string(),
    })
  ),
  wind: z.object({
    speed: z.number(),
  }),
});



export type Weather = z.infer<typeof WeatherSchema>;

export default function useWeather() {
  const [loading, setLoading] = useState(false)
  // ✅ 2) Usa un estado bien tipado
  const [weather, setWeather] = useState<Weather | null>(null);

  // ✅ 3) Función principal para buscar clima
  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    setLoading(true)
    try {
      // 🌎 1) Geocoding para lat/lon
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data: geoData } = await axios(geoUrl);

      if (!geoData.length) {
        throw new Error("Ciudad no encontrada");
      }

      const { lat, lon } = geoData[0];

      // ☁️ 2) Obtener clima
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;
      const { data: weatherResult } = await axios(weatherUrl);

      // ✅ 3) Validar con Zod
      const result = WeatherSchema.safeParse(weatherResult);

      if (result.success) {
        // 🔥 4) Convertir de Kelvin a Celsius
        const parsed = {
          ...result.data,
          main: {
            ...result.data.main,
            temp: Number((result.data.main.temp - 273.15).toFixed(1)),
            temp_max: Number((result.data.main.temp_max - 273.15).toFixed(1)),
            temp_min: Number((result.data.main.temp_min - 273.15).toFixed(1)),
            feels_like: Number((result.data.main.feels_like - 273.15).toFixed(1)),
          },
        };
        setWeather(parsed);
        
      } else {
        console.error("Validación fallida:", result.error.format());
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  };

  const hasWeatherData = useMemo(() => Boolean(weather), [weather]);

  return {
    weather,
    loading,
    fetchWeather,
    hasWeatherData,
  };
}
