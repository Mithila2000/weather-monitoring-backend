// utils/fetchWeather.js
const axios = require('axios');
require('dotenv').config();

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const apiKey = process.env.OPENWEATHER_API_KEY;

async function fetchWeather() {
    try {
        const responses = await Promise.all(
            cities.map(city =>
                axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                    params: {
                        q: city,
                        appid: apiKey
                    }
                })
            )
        );
        return responses.map(response => response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

module.exports = fetchWeather;
