const express = require('express');
const monitorController = require('../controllers/monitorController');

const router = express.Router();

router.post('/register', monitorController.registerService);
router.get('/health', monitorController.getAllHealth);
router.get('/health/:name', monitorController.getServiceHealth);

module.exports = router;
