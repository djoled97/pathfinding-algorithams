const { addNeighbors } = require("./addNeighbor");
const size=50
const draw = (ctx, arr2D, start, end,counter,cols,rows,diagonals) => {
    for (let i = 0; i < arr2D.length; i++) {
      for (let j = 0; j < arr2D[i].length; j++) {
        arr2D[i][j] = {};
        arr2D[i][j].f = 0;
        arr2D[i][j].g = 0;
        arr2D[i][j].h = 0;

        arr2D[i][j].x = i;
        arr2D[i][j].y = j;
        arr2D[i][j].parent = undefined;
        arr2D[i][j].isVisited = false;
        arr2D[i][j].distance = Infinity;
       
        arr2D[i][j].wall = false;

        ctx.beginPath();
        ctx.rect(i * size, j * size, size, size);
        ctx.stroke();

        if (arr2D[i][j] === start || arr2D[i][j] === end) {
          arr2D[i][j].wall = false;
        }
      }
    }

    for (let i =0; i < counter; i++) {
     
      let x = Math.round(Math.random() * (cols - 1));
      let y = Math.floor(Math.random() * (rows - 1));

      arr2D[x][y].wall = true;
    
        ctx.beginPath();
        
        ctx.fillStyle = "black";
        ctx.fillRect(x * size, y * size, size, size);
    
    }

    for (let i = 0; i < arr2D.length; i++) {
      for (let j = 0; j < arr2D[i].length; j++) {
        arr2D[i][j].neighbors = addNeighbors(arr2D, arr2D[i][j], +cols, +rows,diagonals);
      }
    }
  };

  export {draw}