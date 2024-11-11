module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/monitoring',
    monitorInterval: parseInt(process.env.MONITOR_INTERVAL) || 60000,
    notificationEmail: process.env.NOTIFICATION_EMAIL || 'monitoring@ejemplo.com'
};
