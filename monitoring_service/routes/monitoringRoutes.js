const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');

router.post('/register', monitoringController.registerMicroservice);
router.get('/health', monitoringController.getHealthAll);
router.get('/health/:microservicio', monitoringController.getHealthSingle);

module.exports = router;
