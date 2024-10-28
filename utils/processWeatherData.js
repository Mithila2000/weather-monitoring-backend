// utils/processWeatherData.js
const Weather = require('../models/Weather');

async function processWeatherData(data) {
    // Convert Kelvin to Celsius and store summary data
    const weatherSummary = data.map(entry => ({
        city: entry.name,
        main: entry.weather[0].main,
        temp: entry.main.temp - 273.15,
        feels_like: entry.main.feels_like - 273.15,
        dt: new Date(entry.dt * 1000)
    }));

    for (const summary of weatherSummary) {
        await Weather.create(summary);
    }

    console.log('Daily weather data processed and stored.');
}

module.exports = processWeatherData;
