const notificationService = require('../services/notificationService');
const Notification = require('../models/Notification');

// Crear notificación y enviarla de forma síncrona
exports.createSyncNotification = async (req, res) => {
  const { recipients, channels, message } = req.body;

  try {
    const notification = new Notification({
      recipients,
      channels,
      message,
      state: 'pending',
    });

    await notification.save();

    // Enviar la notificación de forma síncrona
    const result = await notificationService.sendSyncNotification(notification);

    res.status(200).json({
      message: 'Notificación enviada con éxito',
      notification,
      result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar la notificación', error });
  }
};

// Crear notificación y enviarla de forma asíncrona
exports.createAsyncNotification = async (req, res) => {
  const { recipients, channels, message } = req.body;

  try {
    const notification = new Notification({
      recipients,
      channels,
      message,
      state: 'pending',
    });

    await notification.save();

    // Enviar la notificación de forma asíncrona
    notificationService.sendAsyncNotification(notification);

    res.status(200).json({
      message: 'Notificación enviada con éxito (asíncrona)',
      notification
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar la notificación', error });
  }
};

// Obtener todas las notificaciones
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las notificaciones', error });
  }
};

// Obtener una notificación específica
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la notificación', error });
  }
};
