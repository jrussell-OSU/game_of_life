//-------------------SETUP--------------------------


'use strict';

//const express = require('express');

//app.use(express.json());

//app.enable('trust proxy');

//const {Datastore} = require('@google-cloud/datastore');
//const { auth } = require('express-openid-connect');
//const config = require('./secrets/config.json')
//const bodyParser = require('body-parser');
//const handlebars = require('express-handlebars');
//import express from 'express';

const http = require('http');
const path = require('path');
const handlebars = require('express-handlebars');
const express = require('express');
const app = express();
app.use(express.static('static'));
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/game_of_life', (req, res) => {
  res.render('game_of_life');
});


//------------------------RUN APP----------------------------------


//const PORT = parseInt(parseInt(process.env.PORT)) || 8080;
//app.listen(PORT, () => {
  //if (DEBUG) console.log(`App listening on port ${PORT}`);
  //if (DEBUG) console.log//('Press Ctrl+C to quit.');
//});

//module.exports = app;

//const server = http.createServer(app);
//const port = 8080;
//server.listen(port);
//console.debug('Server listening on port:', port);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
});
