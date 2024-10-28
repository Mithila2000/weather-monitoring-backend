// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const cron = require('node-cron');
const fetchWeather = require('./utils/fetchWeather');
const processWeatherData = require('./utils/processWeatherData');
const checkAlerts = require('./utils/checkAlerts');
const Weather = require('./models/Weather');
const Alert = require('./models/Alert');  // Assume we have an Alert model to store alert history
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your frontend's origin if needed
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://mithilasonar17:rQUCUna0HtNv9HNN@cluster0.v65do.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Fetch weather data every 5 minutes
cron.schedule('*/1 * * * *', async () => {
    const weatherData = await fetchWeather();
    await processWeatherData(weatherData);
    await checkAlerts();
});

// Route to get weather data
app.get('/weather', async (req, res) => {
    try {
        const weatherSummaries = await Weather.find().sort({ dt: -1 }).limit(30);  // Get recent 30 entries
        res.json(weatherSummaries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});

// Route to get alerts
app.get('/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 }).limit(10);  // Get recent 10 alerts
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve alerts' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
