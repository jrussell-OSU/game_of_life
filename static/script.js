
//Dynamically create a table from python info that updates every second
setInterval(function() {
  fetch('/grid').then(response => response.json()).then(gol_grid => {
    //create table
    let doc_body = document.getElementsByTagName('body')[0];
    let tbl = document.createElement('TABLE');
    doc_body.appendChild(tbl);
    let tbl_body = document.createElement('TBODY');
    tbl.appendChild(tbl_body);
    let rows = gol_grid;
    for (let i=0; i<rows.length; i++){
      let tbl_row = document.createElement('TR');
      tbl_body.appendChild(tbl_row);
      let curr_row = rows[i];
      for (let j=0; j<curr_row.length; j++){
        let curr_cell = curr_row[j]
        if (curr_cell === 1){
          //create a living cell
          let cell = document.createElement('TD');
          cell.className = "living_cell";  //add to CSS for background color
          tbl_row.appendChild(cell);
        } else {
          //create a dead cell
          let cell = document.createElement('TD');
          cell.className = "dead_cell"; //add to CSS if needed
          tbl_row.appendChild(cell);
        }
      }
    }
  });
}, 1000);