const mongoose = require('mongoose');

const monitoredServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    endpoint: { type: String, required: true },
    frequency: { type: Number, required: true },
    notificationEmail: { type: String, required: true },
    lastStatus: { type: String, default: 'UNKNOWN' },
    lastChecked: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonitoredService', monitoredServiceSchema);
