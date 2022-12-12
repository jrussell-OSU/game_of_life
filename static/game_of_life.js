

//Disable start button and speed slider until new game is set up
document.getElementById("start_game").disabled = true;
document.getElementById("myRange").disabled = true;
document.getElementById("pause_button").disabled = true;
document.getElementById("color_picker").disabled = true;

//Change color of living cell based on color picker input
//document.getElementById("color_picker").disabled = true;
let living_color = "#2ACB70";  //Default cell color

const color_picker = document.getElementById("color_picker");
color_picker.oninput = function() {
  pause();   //pause game while changing color
  living_color = this.value;
  let cells = document.querySelectorAll('td.living_cell');
  for(let i = 0; i < cells.length; i++){
  cells[i].style.backgroundColor = living_color;
  }
}


class Game {
  constructor() {
    //type of starting "seed" grid
    this.rows = 50;
    this.columns = 50;
    this.probability = 6;
    this.grid = [];
    this.blank_grid = [];
    this.all_coords = [];
    this.game_interval = null;  //holds the game cycle setInterval() object
    this.cell_size = "10px";
    this.cell_padding = true;
    this.cycle_speed = 200;
    this.living_color = "#2ACB70";
  }

  //Set up game and get initial starting seed grid
  setup(seed_type = "random") {
    document.getElementById("create_game").disabled = true;
    this.create_blank_grid();
    this.set_all_cell_coords();
    this.set_seed(seed_type);
    this.start();
    document.getElementById("start_game").disabled = false;
    document.getElementById("color_picker").disabled = false;

  }

  //Causes the game of life to cycle until stopped at rate of cycle_speed
  play() {
    this.game_interval = setInterval(() => this.update_game(), this.cycle_speed);
  }

  pause() {
    console.log("game paused");
    clearInterval(this.game_interval);
    document.getElementById("start_game").disabled = false;
    document.getElementById("pause_button").disabled = false;
  }

  //First grid display, set up table cells to display game of life grid
  start() {
     // document.getElementById("start_game").disabled = true;
     //document.getElementById("dropdownMenuButton").disabled = true;
    document.getElementById("color_picker").disabled = false;

    //document.getElementById("color_picker").disabled = false;

    //first, create initial table grid for the game
    //create table
    let game_div = document.getElementById('game_div');
    let tbl = document.createElement('TABLE');
    game_div.appendChild(tbl);
    tbl.style.height = this.grid.length
    tbl.style.width = this.grid[0].length
    let tbl_body = document.createElement('TBODY');
    tbl.id = "game_table";
    tbl.appendChild(tbl_body);
    let rows = this.grid;
    for (let i = 0; i < rows.length; i++) {
      let tbl_row = document.createElement('TR');
      tbl_body.appendChild(tbl_row);
      let curr_row = rows[i];
      for (let j = 0; j < curr_row.length; j++) {
        let curr_cell = curr_row[j];
        let cell = document.createElement('TD');
        cell.style.height = this.cell_size;
        cell.style.width = this.cell_size;
        tbl_row.appendChild(cell);

        if (curr_cell === 0) {
          //create a dead cell
          cell.className = "dead_cell";  //add to CSS for background color
          cell.style.backgroundColor = "transparent";
        } else {
          //create a living cell
          cell.className = "living_cell"; //add to CSS if needed
          cell.style.backgroundColor = this.living_color;
        }
      }
    }
  }

  //Called every cycle to use table cells to display game of life grid
  update_game() {
    this.update_cell_values();
    document.getElementById("start_game").disabled = true;
    //document.getElementById("myRange").disabled = true;  //disallow start of game until seed chosen
    document.getElementById("create_game").disabled = true;  //disallow start of game until seed chosen
    document.getElementById("pause_button").disabled = false;

      //Iterate through the given current grid state from python, for each cell
      //turn the corresponding html table cell "on" or "off" (color or transparent)
      let game_div = document.getElementById('game_div');
      let tbl = game_div.firstChild;
      let tbl_body = tbl.firstChild;
      let rows = this.grid;
      let tbl_rows = tbl_body.children;
      for (let i = 0; i < rows.length; i++) {
        let tbl_row = tbl_rows[i];
        let curr_row = rows[i];
        let row_children = tbl_row.children;
        for (let j = 0; j < curr_row.length; j++) {
          let curr_cell = curr_row[j];
          let cell = row_children[j];
          cell.style.height = this.cell_size;
          cell.style.width = this.cell_size;

          if (curr_cell === 0) {
            //dead cell
            cell.className = "dead_cell";  //add to CSS for background color
            cell.style.backgroundColor = "transparent";
          } else {
            //living cell
            cell.className = "living_cell"; //add to CSS if needed
            cell.style.backgroundColor = this.living_color;
          }
        }
      }
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

  //takes cell coords [x, y], returns total num of living neighbors for that cell
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

        neighbors += grid[yn][xn];

        //neighbors += grid[(y+j)%this.rows][(x+i)%this.columns];
      }
    }
    if (grid[y][x] == 1) {
      neighbors -= 1;  //don't count this as neighbor
    }
    return neighbors;
  }

  //Called every cycle to update cell values
  //If cell is dead and has exactly 3 neighbors: it lives
  //If cell has < 2 or > 3 neighbors: it dies
  update_cell_values() {
    const saved_grid = structuredClone(this.grid); //make copy of grid
    console.log(this.grid);
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

  //Grid on/off button, separates or collapses border between cells
  //To keep same table size, cells with the borders are also shrunk slightly
  collapse_border() {
    let game_div = document.getElementById('game_div');
    let tbl = game_div.firstChild;
    if (this.cell_padding === true) {
      this.cell_size = "8px";
      tbl.style.borderCollapse = "separate";
      this.cell_padding = false;
    }
    else {
      tbl.style.borderCollapse = "collapse";
      this.cell_size = "10px";
      this.cell_padding = true;
      }
    let cells = document.querySelectorAll('td');
      for(let i = 0; i < cells.length; i++){
        cells[i].style.height = this.cell_size;
        cells[i].style.width = this.cell_size;
      }
  }
}

let game = new Game();

