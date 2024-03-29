//Author: Jacob Russell

window.addEventListener("load", page_setup, false);

//Starts a new Game() and sets up webpage as needed
function page_setup() {

  //Disable start button and speed slider until new game is set up
  disable_elements(["run_game", "myRange", "pause", "color_picker"]);

  //Starts and runs new game of life
  globalThis.game = new Game();

  //Setup cell color picking
  color_picker_event_setup();

  //Setup cycle speed slider
  cycle_speed_event_setup();

  //Wikipedia text scraper
  more_info_modal_text();
}

function new_game() {
  globalThis.game = new Game();
  globalThis.game.setup();
  globalThis.game.pause();
  document.getElementById("run_game").disabled = true;
}

//Change color of living cell based on color picker input
function color_picker_event_setup() {
  const color_picker = document.getElementById("color_picker");
  color_picker.addEventListener("input", function () {game.change_cell_color(this.value)}, false);
}

//Slider that allows changing the game cycle speed
function cycle_speed_event_setup () {
  const cycle_speed_slider = document.getElementById("myRange");
  //cycle_speed_slider.addEventListener("mousedown", function () {game.pause()}, false);
  //cycle_speed_slider.addEventListener("touchstart", function () {game.pause()}, false);
  cycle_speed_slider.addEventListener("change", function () {game.change_cycle_speed(this.value)}, false);
  cycle_speed_slider.addEventListener("change", function () {game.pause()}, false);
  cycle_speed_slider.addEventListener("change", function () {game.run_game()}, false);

}

//For displaying first paragraph of "Conway's game of life" wikipedia page when user clicks "more info" button
function more_info_modal_text() {

    //ref: https://www.w3schools.com/howto/howto_css_modals.asp
    let modal = document.getElementById("more_info");
    let btn = document.getElementById("more_info_button");
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
    modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
}

//Given list of html elements, disables them all
function disable_elements(el_arr) {
  for (let i = 0; i < el_arr.length; i++){
    document.getElementById(el_arr[i]).disabled = true;
  }
}

//Given list of html elements, enables them all
function enable_elements(el_arr) {
  for (let i = 0; i < el_arr.length; i++){
    document.getElementById(el_arr[i]).disabled = false;
  }
}

//Game of Life
class Game {
  constructor() {
    //type of starting "seed" grid
    this.rows = 120;
    this.columns = 120;
    this.probability = 9;  //affects chance of initial cell being alive, higher num == lower chance
    this.grid = [];
    this.blank_grid = [];
    this.all_coords = [];
    this.cycle_timer = null;  //holds the game cycle setInterval() object
    this.cell_size = "8px";
    this.cell_size_min = "6px";  //gives a "grid" appearance
    this.cell_size_max = "8px";  //gives a "blob" appearance
    this.cell_padding = true;
    this.cycle_speed = 150;  //lower number = faster
    this.cycle_count = 0;
    this.living_color = "#D192DD";
    //this.living_color = "#C165EC"
    //this.living_color = "#CE6566";
    this.cycle_speed_max = 1000;
  }

  //Set up game and get initial starting seed grid
  setup(seed_type="random") {
    this.create_blank_grid();
    this.set_all_cell_coords();
    this.set_seed(seed_type);
    this.create_game();
    this.update_game();
    document.getElementById("run_game").disabled = true;
    document.getElementById("color_picker").disabled = false;
    //this.run_game();  # uncomment to autostart game
    //document.getElementById("pause").disabled = false;
    document.getElementById("run_game").disabled = false;

  }

  //Deletes game, so a new game can be created
  //(Removes the game table element)
  delete_game() {
    let game_div = document.getElementById('game_of_life_div');
    let tbl = document.getElementsByTagName('table');
    if (tbl.length > 0){
      game_div.removeChild(tbl[0]);
    }
  }

  create_game() {

    this.pause();
    self.cycle_count++;

    document.getElementById("new_game").disabled = false;
    document.getElementById("color_picker").disabled = false;
    document.getElementById("myRange").disabled = false;
    document.getElementById("run_game").disabled = true;

    this.delete_game();  //Delete any previous games

    //Create the game as a table
    let game_div = document.getElementById('game_of_life_div');
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
          //cell.style.backgroundColor = this.living_color;
        }
      }
    }
  }

  //Causes the game of life to cycle until stopped at rate of cycle_speed
  run_game() {
    document.getElementById("run_game").disabled = true;
    this.cycle_timer = setInterval(() => this.update_game(), this.cycle_speed);
    document.getElementById("new_game").disabled = false;
    document.getElementById("pause").disabled = false;
  }

  pause() {
    clearInterval(this.cycle_timer);
    document.getElementById("run_game").disabled = false;
    document.getElementById("pause").disabled = true;
  }

  //Called every cycle to use table cells to display game of life grid
  update_game() {
    this.cycle_count += 1;
    this.update_cell_values();

      //Iterate through the given current grid state from python, for each cell
      //turn the corresponding html table cell "on" or "off" (color or transparent)
      let game_div = document.getElementById('game_of_life_div');
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
    let game_div = document.getElementById('game_of_life_div');
    let tbl = game_div.firstChild;
    if (this.cell_padding === true) {
      this.cell_size = this.cell_size_min;
      tbl.style.borderCollapse = "separate";
      this.cell_padding = false;
    }
    else {
      tbl.style.borderCollapse = "collapse";
      this.cell_size = this.cell_size_max;
      this.cell_padding = true;
      }
    let cells = document.querySelectorAll('td');
      for(let i = 0; i < cells.length; i++){
        cells[i].style.height = this.cell_size;
        cells[i].style.width = this.cell_size;
      }
  }

  //Changes cell color based on user input to the color
  change_cell_color(color) {
    this.living_color = color
    let cells = document.querySelectorAll('td.living_cell');
    for(let i = 0; i < cells.length; i++){
      cells[i].style.backgroundColor = this.living_color;
    }
  }

  change_cycle_speed(speed) {
    speed = Math.abs(this.cycle_speed_max - speed)
    this.cycle_speed = speed;
  }

}
