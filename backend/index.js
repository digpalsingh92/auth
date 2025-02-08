import express from 'express';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import {DBconnect} from './db/DBconnect.js';
import authRoutes from './routes/auth.route.js';

configDotenv();
const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev')); // log http requests

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(PORT, () => {
    DBconnect();
    console.log(`Server is running on port ${PORT}`);
});