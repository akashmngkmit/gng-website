import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connect from './config/db.js';
import router from './routes/menu-routes.js';

// Load config
dotenv.config();

// Connect to Database
connect();

const app = express();

// Middleware
app.use(cors()); 

app.use(express.json());

// Routes
app.use('/api/menu', router);
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});