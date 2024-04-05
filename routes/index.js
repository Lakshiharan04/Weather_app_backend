const express = require('express');
const router = express.Router();
const weatherRoutes = require('./weatherRoutes');

router.use('/api/weather/all', weatherRoutes);

module.exports = router;
