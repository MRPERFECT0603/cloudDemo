require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});