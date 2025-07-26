import { useState } from 'react';
import axios from 'axios';
import './Weather.css'; // Убедитесь, что этот импорт указывает на ваш файл Weather.css

function Weather() {
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Важно: Храните ваш API-ключ в переменных окружения в реальных проектах,
    // а не напрямую в коде клиента!
    const apiKey = '6cfd768009543c57724b2ab6d2c0e979'
    const getWeatherUrl = (cityName) => `https://api.openweathermap.org/data/2.5/weather?q=${cityName},RU&units=metric&appid=${apiKey}`

    const russianCities = [
        'Москва',
        'Санкт-Петербург',
        'Новосибирск',
        'Екатеринбург',
        'Казань',
        'Нижний Новгород',
        'Челябинск',
        'Омск',
        'Самара',
        'Ростов-на-Дону',
        'Уфа',
        'Красноярск',
        'Воронеж',
        'Пермь',
        'Волгоград'

    ]

    const fetchWeather = async (selectedCity) => {
        try {
            setLoading(true)
            setError(null)
            setCity(selectedCity) // Обновляем состояние city, чтобы видеть, какой город выбран
            const response = await axios.get(getWeatherUrl(selectedCity))
            if (response.data && response.data.main) {
                setWeather(response.data)
            } else {
                setError('Не удалось получить данные о погоде')
            }
        } catch (error) {
            console.error('Error fetching weather:', error)
            // Улучшим сообщение об ошибке для пользователя
            if (error.response && error.response.status === 404) {
                setError(`Город "${selectedCity}" не найден. Пожалуйста, попробуйте другой.`)
            } else {
                setError('Произошла ошибка при получении данных о погоде. Попробуйте еще раз.')
            }
            setWeather(null) // Сбрасываем данные о погоде при ошибке
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="weather-container">
            <h1>Прогноз погоды</h1>
            <div className="search-box">
                {russianCities.map((city) => (
                    <button className='city-button' key={city} onClick={() => fetchWeather(city)}>
                        {city}
                    </button>
                ))}
            </div>
            {loading && <div className="loading">Загрузка...</div>}
            {error && <div className="error">{error}</div>}
            {weather && weather.main && (
                <div className="weather-details">
                    <h2>{weather.name}</h2>
                    <div className="weather-main">
                        <div className="temperature">
                            <span className="temp-value">{Math.round(weather.main.temp)}°C</span>
                            <span className="feels-like">Ощущается как: {Math.round(weather.main.feels_like)}°C</span>
                        </div>
                        <div className="weather-info">
                            <div className="weather-metrics">
                                <div className="metric">
                                    <span>Влажность:</span>
                                    <span>{weather.main.humidity}%</span>
                                </div>
                                <div className="metric">
                                    <span>Ветер:</span>
                                    <span>{Math.round(weather.wind.speed)} м/с</span>
                                </div>
                                <div className="metric">
                                    <span>Давление:</span>
                                    {/* Переводим hPa в мм рт.ст. */}
                                    <span>{Math.round(weather.main.pressure * 0.750062)} мм рт.ст.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Weather;