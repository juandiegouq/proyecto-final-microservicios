const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const monitorRoutes = require('./routes/monitorRoutes');

const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use(monitorRoutes);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servicio de monitoreo corriendo en el puerto ${PORT}`);
});
