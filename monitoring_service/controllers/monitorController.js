const MonitoredService = require('../models/monitoredService');

// Registrar un nuevo microservicio para monitorear
exports.registerService = async (req, res) => {
    const { name, endpoint, frequency, notificationEmail } = req.body;
    try {
        const service = new MonitoredService({ name, endpoint, frequency, notificationEmail });
        await service.save();
        res.status(201).json({ message: 'Servicio registrado para monitoreo', service });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el servicio' });
    }
};

// Obtener el estado de todos los microservicios monitoreados
exports.getAllHealth = async (req, res) => {
    try {
        const services = await MonitoredService.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estado de los servicios' });
    }
};

// Obtener el estado de un microservicio específico
exports.getServiceHealth = async (req, res) => {
    const { name } = req.params;
    try {
        const service = await MonitoredService.findOne({ name });
        if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estado del servicio' });
    }
};
