const express = require('express');
const router = express.Router();
const WeatherStation = require('../models/WeatherStation');

// POST /api/weather
router.post('/', async (req, res) => {
    const { district, temperature, humidity, airPressure } = req.body;

    try {
        const weatherData = new WeatherStation({
            district,
            temperature,
            humidity,
            airPressure
        });

        await weatherData.save();

        res.status(201).json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/weather
router.get('/', async (req, res) => {
    try {
        const weatherData = await WeatherStation.find().sort({ timestamp: -1 }).limit(1);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/weather/periodic
router.get('/periodic', async (req, res) => {
    try {
        const weatherData = await WeatherStation.find().sort({ timestamp: -1 }).limit(1);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
