// models/Weather.js
const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    city: String,
    main: String,
    temp: Number,
    feels_like: Number,
    dt: Date,
    max_temp: Number,
    min_temp: Number,
    avg_temp: Number,
    dominant_condition: String
});

module.exports = mongoose.model('Weather', WeatherSchema);
