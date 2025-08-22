import express from "express";
import { initDb } from "./initializeDB";
import userRoutes from './routes/user.routes'
import documentRoutes from './routes/document.routes';
import messageRoutes from './routes/message.routes';
import cors from 'cors'

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http'], // Allow these origins to make requests
  methods: ["POST", "GET", "OPTIONS"], // Allow these HTTP methods
  credentials: true, // Allow cookies and other credentials to be sent
  allowedHeaders: ["Content-Type", "Authorization", "token"], // Allow the token header
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user', userRoutes)
app.use('/api/document', documentRoutes)
app.use('/api/message', messageRoutes)

initDb().then(() => {
  app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT || 5000}`));
});
