import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/configs/connectDB';
import { initRoutes } from './src/routes/index';
import "./src/passport/index"
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
initRoutes(app)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})