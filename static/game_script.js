
let cell_size = "10px";

document.getElementById("start_game").disabled = true;  //disallow start of game until seed chosen

//Seed starts*********************************
function glider_seed(){
  document.getElementById("seed_dropdown").disabled = true;
  document.getElementById("start_game").disabled = false;
  fetch('/glider');
  //start_game()
}

function random_seed(){
  document.getElementById("seed_dropdown").disabled = true;
  document.getElementById("start_game").disabled = false;
  fetch('/random');
  //start_game()
}

function r_pentomino_seed(){
  document.getElementById("seed_dropdown").disabled = true;
  document.getElementById("start_game").disabled = false;
  fetch('/r_pentomino');
  //start_game()
}

function penta_decathlon_seed(){
  document.getElementById("seed_dropdown").disabled = true;
  document.getElementById("start_game").disabled = false;
  fetch('/penta_decathlon');
  //start_game()
}
//Seed starts END******************************

//Game speed range slider (ref: https://www.w3schools.com/howto/howto_js_rangeslider.asp)
let cycle_speed = 150;
const slider = document.getElementById("myRange");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  cycle_speed = Math.abs(this.value - 750);  //since slider is actually reversed
}

function more_info() {
    window.open("https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life", "_blank");
}

let n = 0;
function collapse_border() {
  let game_div = document.getElementById('game_div');
  let tbl = game_div.firstChild;
  if (n === 0) {
    tbl.style.borderCollapse = "separate";
    cell_size = "8px";
    n++;
  }
  else {
    tbl.style.borderCollapse = "collapse";
    cell_size = "10px";
    n = 0;
  }
}

function change_background(){
  fetch('http://localhost:9995/request=nebula')
      .then(response => response.json())
      .then(data => {
        console.log(data["result"])
        //document.body.style.backgroundImage = "url('" + data["result"] + "')";
        let div = document.getElementById('game_div');
        div.style.backgroundImage = "url('" + data["result"] + "')";
      });
}

//Change color of living cell on button click
//Default cell color
let living_color = "cyan";
const color_choices = ["limegreen", "red", "pink", "orange", "yellow", "black", "indigo", "white", "gray", "cyan"];
let c = 0;
function change_cell_color(){
  if (c >= color_choices.length) {
    c = 0;
  }
  living_color = color_choices[c++];
}

//Run game after the start game button pressed
function start_game() {
  document.getElementById("start_game").disabled = true;
document.getElementById("seed_dropdown").disabled = true;
  //first, create initial table grid for the game
  fetch('/grid').then(response => response.json()).then(gol_grid => {
    //create table
    //let doc_body = document.getElementsByTagName('body')[0];
    let game_div = document.getElementById('game_div');
    //let game_div = document.createElement('div');
    //game_div.id = "game_div";
    //doc_body.appendChild(game_div)
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
  const game_interval = setInterval(update_game, cycle_speed);

}
  //Once initial html table created, modify every x seconds with new cells
  //setInterval(function () {
function update_game() {
  fetch('/grid').then(response => response.json()).then(gol_grid => {
    //create table
    let game_div = document.getElementById('game_div');
    let tbl = game_div.firstChild;
    let tbl_body = tbl.firstChild;
    let rows = gol_grid;
    var tbl_rows = tbl_body.children;
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




