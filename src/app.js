const express = require('express');
const sequelize = require('../config/database');
const authRoutes = require('./routes/authRoutes');
const redditRoutes = require('./routes/redditRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reddits', redditRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
  });
});