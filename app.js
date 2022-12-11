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
const ROWS = 10
const COLUMNS = 10
const PROBABILITY = 3
const CYCLE_SPEED = 200;  //higher == slower


class Game {
  constructor(seed_type="random") {
    this.seed_type = seed_type  //type of starting "seed" grid
    this.rows = ROWS;
    this.columns = COLUMNS;
    this.probability = PROBABILITY;
    this.grid = [];
    this.blank_grid = [];
    this.all_coords = [];
    this.game_interval = null;  //holds the game cycle object
  }

  //Set up game and get initial starting seed grid
  setup() {
    this.create_blank_grid();
    this.set_all_cell_coords();
    this.set_seed(this.seed_type);
  }

  //Causes the game of life to cycle until stopped
  play() {
    this.game_interval = setInterval(() => this.update_and_display(), CYCLE_SPEED);
  }

  update_and_display() {
    this.update_cell_values();
    this.display_grid();
  }

  pause() {
    clearInterval(this.game_interval);
  }

  //Creates 2d array "grid" of dimentions [this.rows][this.columns]
  create_blank_grid() {
    this.blank_grid = Array(this.rows);
    for (let i = 0; i < this.columns; i++) {
      this.blank_grid[i] = Array(this.columns).fill(0);
    }
  }

  //Returns all possible cell coordinates from grid
  //as an array of [x, y] tuples
  set_all_cell_coords() {
    const coords_array = [];
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        coords_array.push([x, y]);
      }
    }
    this.all_coords = coords_array;
  }

  //Takes coordinate pair array [x, y] (representing a cell)and a grid,
  //returns total number of "living" neighbors to that cell
  total_neighbors(coords, grid) {
    let x = coords[0];
    let y = coords[1];
    let neighbors = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {

        let xn = x + i;
        if (xn < 0)  // get positive modulo result
          xn = (((xn % this.columns) + this.columns) % this.columns);
        else
          xn = xn % this.columns;

        let yn = y + j;
        if (yn < 0)
          yn = (((yn % this.rows) + this.rows) % this.rows);
        else
          yn = yn % this.rows;

        neighbors += grid[xn][yn];

        //neighbors += grid[(y+j)%this.rows][(x+i)%this.columns];
      }
    }
    if (grid[y][x] == 1) {
      neighbors -= 1;  //don't count this as neighbor
    }
    return neighbors;
  }

  update_cell_values() {
    const saved_grid = structuredClone(this.grid); //make copy of grid
    for (let i = 0; i < this.all_coords.length; i++) {
      let x = this.all_coords[i][0];
      let y = this.all_coords[i][1];
      let cell = this.grid[y][x];
      let neighbors = this.total_neighbors([x, y], this.grid);
      if (cell == 0 && neighbors == 3){
        //live.push([x, y]);  //resurrect dead cell
        saved_grid[y][x] = 1;
      }
      else {
        if (neighbors < 2 || neighbors > 3) {
          //die.push([x, y]);  //kill living cell
          saved_grid[y][x] = 0;
        }
      }
    }

    this.grid = structuredClone(saved_grid);
  }

  //Starting seeds for the game of life (i.e. decides if each initial cell is alive or dead)
  set_seed (seed_type){

  //Seeds a starting grid with random living cells
  // based on this.probability. Higher probability ==
  // fewer living cells.
    this.grid = structuredClone(this.blank_grid);
    if (seed_type == "random") {
      for (let y = 0; y < this.rows; y++){
        for (let x = 0; x < this.columns; x++){
          let rand_int = Math.floor(Math.random() * this.probability);
          if (rand_int > this.probability - 2){
            this.grid[x][y] = 1;
          }
        }
      }
    }
  }

  display_grid () {
    for (let i = 0; i < this.rows; i++) {
      console.log(this.grid);
    }
  }
}


const game = new Game();
game.setup();
game.play();




//------------------------RUN APP----------------------------------


const PORT = parseInt(parseInt(process.env.PORT)) || 8080;
app.listen(PORT, () => {
  if (DEBUG) console.log(`App listening on port ${PORT}`);
  if (DEBUG) console.log('Press Ctrl+C to quit.');
});

module.exports = app;