
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Starting seeds

//Disable start, continue, and speed buttons until new game is set up
document.getElementById("start_game").disabled = true;
document.getElementById("continue_button").disabled = true;
document.getElementById("myRange").disabled = true;

//Takes the flask route name (e.g. "/random"). returns a new starting grid from python
function choose_seed(seed){
  document.getElementById("dropdownMenuButton").disabled = true;
  document.getElementById("start_game").disabled = false;
  document.getElementById("color_picker").disabled = false;
  fetch(seed).then(response => response.json())
      .then(data => {
        start_game();
      });
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Game speed range slider (ref: https://www.w3schools.com/howto/howto_js_rangeslider.asp)
let cycle_speed = 200;
const slider = document.getElementById("myRange");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  pause_game();
  cycle_speed = Math.abs(this.value - 750);  //since slider is actually reversed

}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Grid on/off button, separates or collapses border between cells
//To keep same table size, cells with the borders are also shrunk slightly
let n = 0;

function collapse_border() {
  let game_div = document.getElementById('game_div');
  let tbl = game_div.firstChild;
  if (n === 0) {
    cell_size = "8px";
    tbl.style.borderCollapse = "separate";
    n++;
  }
  else {
    tbl.style.borderCollapse = "collapse";
    cell_size = "10px";
    n = 0;
    }
  let cells = document.querySelectorAll('td');
    for(let i = 0; i < cells.length; i++){
      cells[i].style.height = cell_size;
      cells[i].style.width = cell_size;
    }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Uses kathleen w.'s image scraper to change the game background image
function change_background(){
  //fetch('http://localhost:9995/request=nebula')  //when run locally

  //Can fetch images based on given word, put any word after "/request="
  //to get a related random (small) image
  fetch('https://kathleen-image-scraper.herokuapp.com/request=nebula')
      .then(response => response.json())
      .then(data => {
        console.log(data["result"])
        let div = document.getElementById('game_div');
        div.style.backgroundImage = "url('" + data["result"] + "')";
      });
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//More Info Modal display using Kyle's Microservice
//ref: https://www.w3schools.com/howto/howto_css_modals.asp

let modal = document.getElementById("more_info");
let btn = document.getElementById("more_info_button");
let span = document.getElementsByClassName("close")[0];
let info_url = "https://wiki-scraper-starfish.herokuapp.com/wiki/?search=Conway%27s_Game_of_Life"

//Populate the text from Kyle's microservice
$.getJSON(info_url, function(data){
  let info_text = document.getElementById("more_info_text");
  info_text.textContent = data["Conway's Game of Life"];
});

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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Change color of living cell based on color picker input

document.getElementById("color_picker").disabled = true;
//let living_color = "#2ACB70";  //Default cell color
let living_color = "#C165EC";
const color_picker = document.getElementById("color_picker");

color_picker.oninput = function() {
  pause_game();   //pause game while changing color
  living_color = this.value;
  let cells = document.querySelectorAll('td.living_cell');
  for(let i = 0; i < cells.length; i++){
  cells[i].style.backgroundColor = living_color;
  }
  //continue_game();  //resume game once color changed
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Pause & Continue Game functions

let game_interval = null;

function pause_game(){
  clearInterval(game_interval);
  document.getElementById("myRange").disabled = false;  //disallow start of game until seed chosen
  document.getElementById("continue_button").disabled = false;  //disallow start of game until seed chosen
  document.getElementById("pause_button").disabled = true;
}

function continue_game(){
  game_interval = setInterval(update_game, cycle_speed);
  document.getElementById("pause_button").disabled = false;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//When "Start" button is pressed. Game of life starting seed grid passed from
//python. Corresponding HTML table is created where each cell of the table
//represents the living or dead cells given from the python game of life grid
let cell_size = "10px";

function start_game() {
 // document.getElementById("start_game").disabled = true;
document.getElementById("dropdownMenuButton").disabled = true;
document.getElementById("color_picker").disabled = false;
document.getElementById("myRange").disabled = false;  //disallow start of game until seed chosen

  //first, create initial table grid for the game
  fetch('/grid').then(response => response.json()).then(gol_grid => {
    //create table
    let game_div = document.getElementById('game_div');
    let tbl = document.createElement('TABLE');
    game_div.appendChild(tbl);
    tbl.style.height = gol_grid.length
    tbl.style.width = gol_grid[0].length
    let tbl_body = document.createElement('TBODY');
    tbl.id = "game_table";
    tbl.appendChild(tbl_body);
    let rows = gol_grid;
    for (let i = 0; i < rows.length; i++) {
      let tbl_row = document.createElement('TR');
      tbl_body.appendChild(tbl_row);
      let curr_row = rows[i];
      for (let j = 0; j < curr_row.length; j++) {
        let curr_cell = curr_row[j];
        let cell = document.createElement('TD');
        cell.style.height = cell_size;
        cell.style.width = cell_size;
        tbl_row.appendChild(cell);

        if (curr_cell === 0) {
          //create a dead cell
          cell.className = "dead_cell";  //add to CSS for background color
          cell.style.backgroundColor = "transparent";
        } else {
          //create a living cell
          cell.className = "living_cell"; //add to CSS if needed
          cell.style.backgroundColor = living_color;
        }
      }
    }
  });
}

//*****************************************************************************************************
//CONTINUE GAME
//Only used after initial game table created (see above)
// Modifies game of life table every (cycle_speed) seconds with new cells
function update_game() {
  document.getElementById("start_game").disabled = true;
  //document.getElementById("myRange").disabled = true;  //disallow start of game until seed chosen
  document.getElementById("continue_button").disabled = true;  //disallow start of game until seed chosen
  fetch('/grid').then(response => response.json()).then(gol_grid => {

    //Iterate through the given current grid state from python, for each cell
    //turn the corresponding html table cell "on" or "off" (color or transparent)
    let game_div = document.getElementById('game_div');
    let tbl = game_div.firstChild;
    let tbl_body = tbl.firstChild;
    let rows = gol_grid;
    let tbl_rows = tbl_body.children;
    for (let i = 0; i < rows.length; i++) {
      let tbl_row = tbl_rows[i];
      let curr_row = rows[i];
      let row_children = tbl_row.children;
      for (let j = 0; j < curr_row.length; j++) {
        let curr_cell = curr_row[j];
        let cell = row_children[j];
        cell.style.height = cell_size;
        cell.style.width = cell_size;

        if (curr_cell === 0) {
          //dead cell
          cell.className = "dead_cell";  //add to CSS for background color
          cell.style.backgroundColor = "transparent";
        } else {
          //living cell
          cell.className = "living_cell"; //add to CSS if needed
          cell.style.backgroundColor = living_color;
        }
      }
    }
  });
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<





