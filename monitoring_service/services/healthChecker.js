const axios = require('axios');
const MonitoredService = require('../models/monitoredService');
const config = require('../config');

// Función para verificar el estado de los servicios registrados
async function checkServicesHealth() {
    const services = await MonitoredService.find();

    for (const service of services) {
        try {
            const response = await axios.get(service.endpoint);
            service.lastStatus = response.data.status || 'DOWN';
            service.lastChecked = new Date();
            await service.save();
        } catch (error) {
            service.lastStatus = 'DOWN';
            service.lastChecked = new Date();
            await service.save();
        }
    }
}

// Ejecuta la verificación a intervalos
setInterval(checkServicesHealth, config.monitorInterval);
