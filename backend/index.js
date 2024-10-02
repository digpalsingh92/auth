import express from 'express';
import {DBconnect} from './db/DBconnect.js';
import { configDotenv } from 'dotenv';
import authRoutes from './routes/auth.route.js';

configDotenv();
const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(PORT, () => {
    DBconnect();
    console.log(`Server is running on port ${PORT}`);
});