//-------------------SETUP--------------------------


'use strict';

const express = require('express');
const app = express();

app.enable('trust proxy');

//const {Datastore} = require('@google-cloud/datastore');
//const { auth } = require('express-openid-connect');
const { engine } = require('express-handlebars');
//const config = require('./secrets/config.json')
const bodyParser = require('body-parser');
//const jwt_decoder = require('jwt-decode');
//const axios = require('axios');
//const { expressjwt: jwt } = require('express-jwt');
//const jwksRsa = require('jwks-rsa');

app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', engine({
  defaultLayout: 'main',
}));

//const datastore = new Datastore({
  //projectId: 'api-portfolio-project-350723',
//});

//Get credentials for data store
//process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './secrets/datastore_auth.json';

const DEBUG = true




//------------------------RUN APP----------------------------------


const PORT = parseInt(parseInt(process.env.PORT)) || 8080;
app.listen(PORT, () => {
  if (DEBUG) console.log(`App listening on port ${PORT}`);
  if (DEBUG) console.log('Press Ctrl+C to quit.');
});

module.exports = app;