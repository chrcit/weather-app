import { WeatherWidget } from "./ui/weather-widget";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="flex container py-20 px-5 sm:px-10 md:px-20 mx-auto ">
      <WeatherWidget />
    </main>
  );
}
