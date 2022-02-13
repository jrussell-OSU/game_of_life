
//Change cycle/interval time based on uesr input
let cycle_speed = 500;  //default
function fast_cycle_speed(){
  cycle_speed = 150;
}
function medium_cycle_speed(){
  cycle_speed = 500;
}
function slow_cycle_speed(){
  cycle_speed = 800;
}

//Player change cell color
function change_color(color) {
  living_color = color;
}

//Changing page background image
const background_images = ["tidal.jpg", "nebula.png", "leaves.jpeg", "city.webp", "space.jpg"];
let i = 0;
let image = null;
function change_background(){
  if (i >= background_images.length){
      i = 0;
  }
  let img_url = "url('../static/images/" + background_images[i++] + "')";
  document.body.style.backgroundImage = img_url;
  //document.body.style.backgroundImage = "url('../static/images/tidal.jpg')";
}

//Change color of living cell on button click
//Default cell color
let living_color = "cyan";
const color_choices = ["limegreen", "red", "pink", "yellow", "black", "white", "cyan"];
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

  //first, create initial table grid for the game
  fetch('/grid').then(response => response.json()).then(gol_grid => {
    //create table
    let doc_body = document.getElementsByTagName('body')[0];
    let game_div = document.createElement('div');
    game_div.id = "game_div";
    doc_body.appendChild(game_div)
    let tbl = document.createElement('TABLE');
    game_div.appendChild(tbl);
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

  //Once initial html table created, modify every x seconds with new cells
  setInterval(function () {
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
  }, cycle_speed);

}



