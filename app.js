const express = require('express');
const app = express();
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const bodyparser = require('body-parser');
const path = require('path');

mongoose.connect('mongodb+srv://Admin:adminpassword@cluster0.twlns.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie ! (Admin)'))
  .catch(() => console.log('Connexion Admin à MongoDB échouée ! (Admin)'));

  /*mongoose.connect('mongodb+srv://Admin:adminpassword@cluster0.twlns.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie ! (Non-admin)'))
  .catch(() => console.log('Connexion à MongoDB échouée ! (Non-admin)'));*/

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyparser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
  
app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

module.exports = app;
