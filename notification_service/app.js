const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(notificationRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
