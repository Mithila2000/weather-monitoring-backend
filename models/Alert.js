// models/Alert.js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    message: String,
    city: String,
    threshold: Number,
    currentTemp: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
