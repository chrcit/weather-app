"use client";

import { KeyboardEvent, useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetchWeatherData } from "~/swr/use-fetch-weather-data";
import { LoadingSpiner } from "../loading-spinner";
import { usePrevious } from "~/hooks/use-previous";
import { PrefetchLinks } from "../prefetch-links";
import { sliderVariants } from "./animation-variants";
import { BackButton, NextButton } from "./buttons";
import { getOpenWeatherIconUrl } from "./utils";

export const WeatherWidget = () => {
  const id = useId();
  const [activeDay, setActiveDay] = useState(0);
  const previousDay = usePrevious(activeDay);
  const { data, isLoading, error } = useFetchWeatherData({
    city: "Vienna",
  });

  const handlePrev = () => {
    setActiveDay(activeDay !== 0 ? activeDay - 1 : activeDay);
  };

  const handleNext = () => {
    setActiveDay(
      data?.list && activeDay !== data.list.length - 1
        ? activeDay + 1
        : activeDay
    );
  };

  const handleKeyPress = (e: globalThis.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeDay]);

  if (isLoading) {
    return <LoadingSpiner size={20} />;
  }

  if (error || data?.list === undefined || data.list.length === 0) {
    return (
      <p>
        Wetter-Daten konnten nicht geladen werden. <br /> Fehler:{" "}
        {error?.issues.map((issue) => issue.message).join(", ")}
      </p>
    );
  }

  const icons = Array.from(
    new Set((data.list ?? []).map((d) => d.weather?.at(0)?.icon))
  ).filter(Boolean) as string[];

  const direction = previousDay < activeDay ? 1 : -1;

  const activeData = data.list[activeDay];
  const city = data.city;
  const weather = activeData.weather.at(0);
  const wind = activeData.wind;

  console.log(activeData.dt);

  return (
    <>
      <motion.article
        layout
        className="w-full max-w-[900px] mx-auto pt-24 sm:py-10 pb-10 px-5 sm:px-8 md:py-10 md:px-20 touch-pan-x  bg-stone-50 overflow-hidden rounded-md shadow-md relative"
        onPan={(e, info) => {
          if (info.delta.x < 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }}
        key={`weather-widget-${id}-${activeDay}`}
      >
        <div className="h-fit md:h-full px-2 absolute w-fit left-0 sm:left-8 md:left-0  top-5 sm:top-14 md:top-0 bg-stone-50 z-20 flex items-center justify-center">
          <BackButton onClick={handlePrev} disabled={activeDay === 0} />
        </div>

        <div className="h-fit md:h-full px-2 w-fit right-0 sm:right-8 md:right-0  top-5 sm:top-14 md:top-0 bg-stone-50 z-20 flex items-center justify-center absolute">
          <NextButton
            onClick={handleNext}
            disabled={activeDay === data.list.length - 1}
          />
        </div>

        <div className="gap-10 flex flex-col">
          <header className="flex flex-col items-center gap-1 text-center  border-stone-600">
            <h1 className="flex items-center gap-3">
              <span className="text-5xl font-semibold ">
                {city.name}, {city.country}
              </span>
            </h1>
            <aside className="flex flex-row text-lg text-stone-600 gap-5 items-center">
              <p>
                {new Date(activeData.dt * 1000).toLocaleDateString("de-AT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </aside>
          </header>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              custom={direction}
              variants={sliderVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.3 },
                opacity: { duration: 0.5 },
              }}
              className="gap-y-10 flex flex-col items-center"
              key={`weather-widget-${id}-${activeDay}-content`}
            >
              <div className="flex flex-col md:flex-row items-center gap-x-3">
                <div className="flex flex-col xs:flex-row gap-x-2 justify-center items-center">
                  <div className="aspect-square items-center justify-center flex">
                    {weather?.icon && (
                      <img
                        src={getOpenWeatherIconUrl(weather.icon)}
                        className="w-28 h-auto"
                        alt=""
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-[150px] mb-3 xs:mb-0 text-center">
                    <div className="font-bold text-4xl">
                      {Math.round(activeData.main.temp_max)}°C
                    </div>
                    <div className="text-xl text-stone-600">
                      {Math.round(activeData.main.temp_min)}°C
                    </div>
                  </div>
                </div>

                <p className="text-base text-center md:text-left">
                  {weather?.description} <br />
                  gefühlte Temperatur: {Math.round(activeData.main.feels_like)}
                  °C
                </p>
              </div>

              <div className="flex flex-col">
                <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    {
                      label: "Niederschlag",
                      value: `${activeData.rain?.["3h"] ?? 0} mm/h`,
                    },
                    {
                      label: "Wind",
                      value: `${activeData.wind.speed} km/h`,
                    },
                    {
                      label: "Windböen",
                      value: `bis ${wind.gust} km/h`,
                    },
                    {
                      label: "Luftfeuchtigkeit",
                      value: `${activeData.main.humidity}%`,
                    },
                  ].map(({ label, value }) => (
                    <li
                      className="flex flex-col border-stone-200 rounded-md border-2"
                      key={label}
                    >
                      <span className="font-semibold bg-stone-200 py-1 px-4 text-sm">
                        {label}:
                      </span>
                      <span className="py-1 px-4 text-lg">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.article>
      <PrefetchLinks links={icons.map((icon) => getOpenWeatherIconUrl(icon))} />
    </>
  );
};
