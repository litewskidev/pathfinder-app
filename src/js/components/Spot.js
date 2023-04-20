import { select } from '../settings.js';

class Spot {
  constructor(i, j){
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.isClicked = false;
    this.isStart = false;
    this.isEnd = false;

    this.showGrid = function (){
      let html = '';
      let squareHeight = 65;  //  SQUARE SIZE
      let squareWidth = 65;   //  SQUARE SIZE
      for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){  //  GRID HEIGHT
          html += '<div id="square" class="square" data-row="' + j + '" data-col="' + i + '" style="width: ' + squareWidth + 'px; height: ' + squareHeight +'px"></div>';
        }
      }

      let grid = document.querySelector(select.elements.grid);
      let width = 10;  //  GRID WIDTH
      let gridWidth = width * squareWidth;
      grid.style.width = `${gridWidth}px`;
      grid.innerHTML = html;
    };

    this.addNeighbors = function (grid){
      let cols = 10;
      let rows = cols;
      let i = this.i;
      let j = this.j;
      if (i < cols - 1){
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0){
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1){
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0){
        this.neighbors.push(grid[i][j - 1]);
      }
    };
  }
}

export default Spot;
