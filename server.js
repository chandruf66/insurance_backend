require('dotenv').config();
require('./cpuMonitor');
const express = require('express');
const connectDB = require('./config/db');
const { monitorCPU } = require('./controllers/systemController');
const scheduleRoute = require('./routes/schedulerRoutes');
const policyRoutes =require('./routes/policyRoutes')
const systemRoutes=require('./routes/systemRoutes')
const cors = require('cors');
const app = express();
require('./cron/schedulerJob');


// ✅ Allow all CORS
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// ✅ Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CORS is working!' });
});

connectDB();
monitorCPU();

app.use('/api/policies', policyRoutes);
app.use('/api/system', systemRoutes);
app.use('/api', scheduleRoute);


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
