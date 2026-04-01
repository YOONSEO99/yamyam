const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dbConnect = require('./lib/db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});