import express, { Express } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import securityHandler from './securityHandler';
import fileRoutes from './routes/fileRoutes';
import session from 'express-session';
import passport from 'passport';
import './passport-config';  // Import the passport configuration
import path from 'path';
import fs from 'fs';
import ideaRoute from './routes/ideaRoutes';
import employeeStatusRoute from "./routes/employeeStatusRoute"; // Import the employee stats route

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Add security to application
securityHandler(app);

app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and session handling
app.use(passport.initialize());
app.use(passport.session());
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ideas', ideaRoute);
app.use("/api/employee", employeeStatusRoute); // Use the employee stats route


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Database connection error:', error));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});