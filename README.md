# Weather App
A basic weather app that uses the OpenWeatherMap API to display the current weather in a given city.

# Features
- Forecast for Vienna in 3h intervals
- Responsive design
- Revalidate data `onWindowFocus` and component mount
- Swipe to switch between 3h intervals
- Displays:
    - location name
    - date + hour
    - min/max temperature
    - feels like temperature    
    - weather icon
    - rain
    - wind
    - humidity
    - gust

## Stack
- Typescript
- Next.js 13 w/ React
- swr (data fetching)
- Tailwind CSS (styling)
- Framer Motion (animations)
- OpenWeatherMap API (data)