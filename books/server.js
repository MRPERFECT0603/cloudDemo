import express from 'express';
import dotenv from 'dotenv';
import bookRoutes from './routes.js';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
app.use(express.json());


app.use('/book', bookRoutes);

const startServer = async () => {
  try {
    global.db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to AWS RDS MySQL');
    app.listen(process.env.PORT || 3000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
    );
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

startServer();