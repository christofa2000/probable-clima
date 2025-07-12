import styles from "./app.module.css";
import Form from "./components/form/form"; // Usa la mayúscula correcta según tu archivo
import Spinner from "./components/spinner/Spinner";
import useWeather from "./hooks/useWeather";
import WeatherDetail from "./WeatherDetail/WeatherDetail";

export default function App() {
  const { weather, loading, fetchWeather, hasWeatherData } = useWeather();

  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>

      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />

        <div className={styles.weatherWrapper}>
          {loading && <Spinner />}
          {hasWeatherData && weather && (
            <WeatherDetail weather={weather} />
          )}
        </div>
      </div>
    </>
  );
}
