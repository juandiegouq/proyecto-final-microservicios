const Microservice = require('../models/Microservice');
const axios = require('axios');

exports.registerMicroservice = async (req, res) => {
  try {
    const { name, endpoint, frequency, emails } = req.body;
    const newMicroservice = new Microservice({ name, endpoint, frequency, emails });
    await newMicroservice.save();
    res.status(201).json({ message: 'Microservicio registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el microservicio', error });
  }
};

exports.getHealthAll = async (req, res) => {
  try {
    const microservices = await Microservice.find();
    const healthChecks = await Promise.all(
      microservices.map(async (service) => {
        try {
          const healthResponse = await axios.get(`${service.endpoint}/health`);
          return { name: service.name, status: healthResponse.data };
        } catch (error) {
          return { name: service.name, status: 'Offline' };
        }
      })
    );
    res.status(200).json(healthChecks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estado de los microservicios', error });
  }
};

exports.getHealthSingle = async (req, res) => {
  const { microservicio } = req.params;
  try {
    const service = await Microservice.findOne({ name: microservicio });
    if (!service) {
      return res.status(404).json({ message: 'Microservicio no encontrado' });
    }
    const healthResponse = await axios.get(`${service.endpoint}/health`);
    res.status(200).json({ name: service.name, status: healthResponse.data });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el estado del microservicio', error });
  }
};
