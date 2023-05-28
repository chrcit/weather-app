import { NextResponse } from "next/server";
import { z } from "zod";

const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = SearchParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!parsed.success) {
    return NextResponse.json(parsed.error, {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { city } = parsed.data;

  try {
    const data = (await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=de`,
      {
        method: "GET",
        next: {
          revalidate: 60,
        },
      }
    ).then((res) => res.json())) as WeatherDataResponse;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const SearchParamsSchema = z.object({
  city: z.string().optional(),
});

export type GetWeatherDataSearchParams = z.infer<typeof SearchParamsSchema>;

export type WeatherDataResponse = z.infer<typeof WeatherDataResponseSchema>;

export const WeatherDataResponseSchema = z.object({
  cod: z.string(),
  message: z.number(),
  cnt: z.number(),
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        temp: z.number(),
        feels_like: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        pressure: z.number(),
        sea_level: z.number(),
        grnd_level: z.number(),
        humidity: z.number(),
        temp_kf: z.number(),
      }),
      weather: z.array(
        z.object({
          id: z.number(),
          main: z.string(),
          description: z.string(),
          icon: z.string(),
        })
      ),
      clouds: z.object({
        all: z.number(),
      }),
      wind: z.object({
        speed: z.number(),
        deg: z.number(),
        gust: z.number(),
      }),
      visibility: z.number(),
      pop: z.number(),
      sys: z.object({
        pod: z.string(),
      }),
      dt_txt: z.string(),
      rain: z
        .object({
          "3h": z.number(),
        })
        .optional(),
    })
  ),
  city: z.object({
    id: z.number(),
    name: z.string(),
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    country: z.string(),
    population: z.number(),
    timezone: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
});
