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

//Fetches first paragraph of Conway's Game of Life wikipedia page, to be later displayed on /game_of_life to the user
async function get_wiki_text() {
  try {
    const query_params = {
        "action": "query",
        "format": "json",
        "prop": "extracts",
        "titles": "Conway's_Game_of_Life",
        "formatversion": "2",
        "exsentences": "5",
        "explaintext": true,
        "exintro": true
      }

    const params = new url.URLSearchParams(query_params);
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?${params}`);
    let result = response.data.query.pages[0].extract;
    result = JSON.stringify(result);
    //result = result.replace(/<[^>]*>/g);
    const context = {
      wiki_text: result
    }
    return context;
  } catch (error) {
    console.error(error);
  }
}

app.get('/game_of_life', async function (req, res) {
  const context = await get_wiki_text();  //include the "more info" text we got from wikipedia Conway's Game of Life article
  res.render('game_of_life', {context: context});
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
