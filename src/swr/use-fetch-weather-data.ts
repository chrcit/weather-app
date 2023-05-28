import useSWR from "swr";
import type { ZodError } from "zod";
import {
  GetWeatherDataSearchParams,
  WeatherDataResponse,
} from "~/app/api/get-weather-data/route";

async function fetchWeatherData({ city }: GetWeatherDataSearchParams) {
  try {
    return (await fetch(`/api/get-weather-data?city=${city}`, {
      method: "GET",
    }).then((res) => res.json())) as WeatherDataResponse;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export const useFetchWeatherData = ({ city }: GetWeatherDataSearchParams) => {
  const { data, error, isLoading } = useSWR([city], ([city]) =>
    fetchWeatherData({ city })
  );

  const zodError = error as ZodError | undefined;

  return {
    data,
    isLoading,
    error: zodError,
  };
};
