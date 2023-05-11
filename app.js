//Author: Jacob Russell

//--------SETUP-----------------


//app.enable('trust proxy');
const axios = require('axios');
const url = require('url');
const path = require('path');
const handlebars = require('express-handlebars');
const express = require('express');
const app = express();
app.use(express.static('static'));
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index');
});

//-------------RUN APP----------------


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
