const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Rutas para notificaciones síncronas y asíncronas
router.post('/notifications', notificationController.createSyncNotification);
router.post('/notifications/async', notificationController.createAsyncNotification);

// Rutas para obtener notificaciones
router.get('/notifications', notificationController.getAllNotifications);
router.get('/notifications/:id', notificationController.getNotificationById);

module.exports = router;
