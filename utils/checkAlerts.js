// utils/checkAlerts.js
const nodemailer = require('nodemailer');
const Weather = require('../models/Weather');
const Alert = require('../models/Alert');
require('dotenv').config();

async function checkAlerts() {
    const thresholdTemp = 35;

    const recentData = await Weather.find({
        temp: { $gt: thresholdTemp },
        dt: { $gte: new Date(Date.now() - 2 * 5 * 60 * 1000) } // Last two updates (10 min)
    });

    if (recentData.length >= 2) {
        for (const data of recentData) {
            const alertMessage = `Temperature alert for ${data.city}! The temperature is currently ${data.temp.toFixed(2)}°C, exceeding the threshold of ${thresholdTemp}°C.`;

            // Save the alert to the database
            await Alert.create({
                message: alertMessage,
                city: data.city,
                threshold: thresholdTemp,
                currentTemp: data.temp
            });

            // Send email notification
            sendAlert(alertMessage);
        }
    }
}

function sendAlert(message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ALERT_EMAIL,
            pass: process.env.ALERT_EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.ALERT_EMAIL,
        to: process.env.ALERT_EMAIL,
        subject: 'Weather Alert',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Error sending email:', error);
        else console.log('Email sent:', info.response);
    });
}

module.exports = checkAlerts;
