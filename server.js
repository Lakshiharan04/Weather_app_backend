const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const WeatherStation = require('./models/WeatherStation');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://lakshiharanlksh:dS7R6ZbWamtZMCCo@weather_api.p9zjlgo.mongodb.net/?retryWrites=true&w=majority&appName=Weather_api', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


const districts = [
    { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
    { name: 'Gampaha', latitude: 7.0873, longitude: 79.9995 },
    { name: 'Kalutara', latitude: 6.5854, longitude: 79.9607 },
    { name: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
    { name: 'Matale', latitude: 7.4712, longitude: 80.6235 },
    { name: 'Nuwara Eliya', latitude: 6.9497, longitude: 80.7891 },
    { name: 'Galle', latitude: 6.0535, longitude: 80.2210 },
    { name: 'Matara', latitude: 5.9485, longitude: 80.5350 },
    { name: 'Hambantota', latitude: 6.1236, longitude: 81.1180 },
    { name: 'Jaffna', latitude: 9.6615, longitude: 80.0255 },
    { name: 'Mannar', latitude: 8.9771, longitude: 79.9090 },
    { name: 'Vavuniya', latitude: 8.7540, longitude: 80.4970 },
    { name: 'Mullaitivu', latitude: 9.2674, longitude: 80.8149 },
    { name: 'Kilinochchi', latitude: 9.3854, longitude: 80.3992 },
    { name: 'Batticaloa', latitude: 7.7162, longitude: 81.6787 },
    { name: 'Ampara', latitude: 7.2966, longitude: 81.6711 },
    { name: 'Trincomalee', latitude: 8.5879, longitude: 81.2152 },
    { name: 'Kurunegala', latitude: 7.4860, longitude: 80.3659 },
    { name: 'Puttalam', latitude: 8.0376, longitude: 79.8297 },
    { name: 'Anuradhapura', latitude: 8.3147, longitude: 80.4104 },
    { name: 'Polonnaruwa', latitude: 7.9403, longitude: 81.0188 },
    { name: 'Badulla', latitude: 6.9918, longitude: 81.0550 },
    { name: 'Monaragala', latitude: 6.8874, longitude: 81.3400 },
    { name: 'Ratnapura', latitude: 6.6825, longitude: 80.3992 },
    { name: 'Kegalle', latitude: 7.2514, longitude: 80.3466 }
];



app.use(bodyParser.json());

app.post('/api/weather', async (req, res) => {
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

app.get('/api/weather/all', async (req, res) => {
    try {
        const weatherData = await WeatherStation.find().sort({ timestamp: -1 }).limit(25);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/api/weather', async (req, res) => {
    try {
        const filter = req.query.filter;
        let weatherData;

        
        if (filter) {
            switch (filter) {
                case 'tempMoreThan35':
                    weatherData = await WeatherStation.find({ temperature: { $gt: 35 } }).sort({ timestamp: 1 });
                    break;
                case 'temp29to34':
                    weatherData = await WeatherStation.find({ temperature: { $gte: 29, $lte: 34 } }).sort({ timestamp: 1 });
                    break;
                case 'temp21to28':
                    weatherData = await WeatherStation.find({ temperature: { $gte: 21, $lte: 28 } }).sort({ timestamp: 1 });
                    break;
                case 'tempLowThan20':
                    weatherData = await WeatherStation.find({ temperature: { $lt: 20 } }).sort({ timestamp: 1 });
                    break;
                default:
                    weatherData = await WeatherStation.find().sort({ timestamp: 1 });
                    break;
            }
        } else {
        
            weatherData = await WeatherStation.find().sort({ timestamp: 1 });
        }

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



const insertWeatherData = async () => {
    try {
        for (const districtInfo of districts) {
            const { name, latitude, longitude } = districtInfo;
            const temperature = Math.floor(Math.random() * 30) + 20; 
            const humidity = Math.floor(Math.random() * 60) + 40; 
            const airPressure = Math.floor(Math.random() * 20) + 980; 

            const weatherData = new WeatherStation({
                district: name,
                temperature,
                humidity,
                airPressure,
                latitude,
                longitude
            });

            await weatherData.save();
            console.log('Weather data inserted successfully:', weatherData);
        }
    } catch (error) {
        console.error('Error inserting weather data:', error.message);
    }
};

insertWeatherData();

setInterval(insertWeatherData, 300000); 

app.use('/api', routes); 
app.use('/auth', authRoutes); 



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
