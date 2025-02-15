require('dotenv').config(); 
const express = require('express');
const morgan = require('morgan');
const connectDB = require("./config/db");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const countryRoutes =require("./routes/countryRoutes");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes =require("./routes/cityRoutes");
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); 

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from Divyesh');
});

app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/city', cityRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});