import { select } from '../settings.js';

class Spot {
  constructor(i, j){
    const thisFinder = this;

    thisFinder.i = i;
    thisFinder.j = j;
    thisFinder.f = 0;
    thisFinder.g = 0;
    thisFinder.h = 0;
    thisFinder.neighbors = [];
    thisFinder.previous = undefined;
    thisFinder.isClicked = false;
    thisFinder.isStart = false;
    thisFinder.isEnd = false;
    thisFinder.isWall = true;

    thisFinder.showGrid = () => {
      let html = '';
      let squareHeight = 64;  //  SQUARE SIZE
      let squareWidth = 64;   //  SQUARE SIZE

      for (let i = 0; i < 10; i++){
        for (let j = 0; j < 10; j++){  //  GRID HEIGHT
          html += '<div id="square" class="square" data-row="' + j + '" data-col="' + i + '" style="width: ' + squareWidth + 'px; height: ' + squareHeight +'px"></div>';
        }
      }

      let grid = document.querySelector(select.elements.grid);
      let width = 10;  //  GRID WIDTH
      let gridWidth = width * squareWidth;
      grid.style.width = `${gridWidth}px`;
      grid.innerHTML = html;
    };

    thisFinder.addNeighbors = (grid) => {
      let cols = 10;
      let rows = cols;
      let i = thisFinder.i;
      let j = thisFinder.j;

      if (i < cols - 1){
        thisFinder.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0){
        thisFinder.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1){
        thisFinder.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0){
        thisFinder.neighbors.push(grid[i][j - 1]);
      }

      //  DIAGONAL
      /*
      if (i > 0 && j > 0){
        thisFinder.neighbors.push(grid[i - 1][j - 1]);
      }
      if (i < cols - 1 && j > 0){
        thisFinder.neighbors.push(grid[i + 1][j - 1]);
      }
      if (i > 0 && j < rows - 1){
        thisFinder.neighbors.push(grid[i - 1][j + 1]);
      }
      if (i < cols - 1 && j < rows - 1){
        thisFinder.neighbors.push(grid[i + 1][j + 1]);
      }
      */
    };
  }
}

export default Spot;
