/* eslint-disable indent */
import { classNames, select, templates } from '../settings.js';
import Spot from './Spot.js';

class Finder{
  constructor(element){
    const thisFinder = this;
    thisFinder.element = element;

    thisFinder.cols = 10;
    thisFinder.rows = thisFinder.cols;

    // 1D ARRAY
    thisFinder.grid = new Array(thisFinder.cols);
    // 2D ARRAY
    for (let i = 0; i < this.cols; i++){
      this.grid[i] = new Array(this.rows);
    }
    // SPOTS
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j < this.rows; j++){
        this.grid[i][j] = new Spot(i, j);
      }
    }

    thisFinder.closedSet = [];
    thisFinder.path = [];
    thisFinder.openSet = [];
    thisFinder.start;
    thisFinder.end;

    thisFinder.counter = 0;
    thisFinder.step = 1;
    thisFinder.render();
  }

  changeStep(newStep){
    const thisFinder = this;

    thisFinder.step = newStep;
    thisFinder.render();
  }

  setupGrid(){
    // NEIGHBORS
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j < this.rows; j++){
        this.grid[i][j].addNeighbors(this.grid);
      }
    }
    // SHOW GRID
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j < this.rows; j++){
        this.grid[i][j].showGrid();
      }
    }

    // START
    //this.start = this.grid[0][0];
    // END
    //this.end = this.grid[9][9];
    // PUSH START TO [OPENSET]
    //this.openSet.push(this.start);

    console.log(this.grid);
  }

  searchPath(){
    while (this.openSet.length > 0){
      let lowestIndex = 0;
      for (let i = 0; i < this.openSet.length; i++){
        if (this.openSet[i].f < this.openSet[lowestIndex].f){
          lowestIndex = i;
        }
      }
      let current = this.openSet[lowestIndex];

      // FINDING PATH
      if (current === this.end){
        let temp = current;
        this.path.push(temp);
        while (temp.previous){
          this.path.push(temp.previous);
          temp = temp.previous;
        }
        console.log('DONE!', this.path);
      }

      this.removeFromArray(this.openSet, current);
      this.closedSet.push(current);

      let neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++){
        let neighbor = neighbors[i];

        if (!this.closedSet.includes(neighbor)){
          let tempG = current.g + 1;
          if (this.openSet.includes(neighbor)){
            if (tempG < neighbor.g){
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            this.openSet.push(neighbor);
          }

          // CALCULATE DISTANCE
          neighbor.h = this.heuristic(neighbor, this.end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

    // DISPLAY RESULTS DOM

    for (let i = 0; i < this.path.length; i++){
      const pathNode = this.path[i];
      document.querySelector(`[data-row="${pathNode.i}"][data-col="${pathNode.j}"]`).className = 'square path';
    }

    /*
    for (let i = 0; i < this.closedSet.length; i++){
      const closedNode = this.closedSet[i];
      document.querySelector(`[data-row="${closedNode.i}"][data-col="${closedNode.j}"]`).className = 'square closed';
    }

    for (let i = 0; i < this.openSet.length; i++){
      const openNode = this.openSet[i];
      document.querySelector(`[data-row="${openNode.i}"][data-col="${openNode.j}"]`).className = 'square open';
    }
    */
  }

  removeFromArray(arr, elem){
    for (let i = arr.length - 1; i >= 0; i--){
      if (arr[i] === elem){
        arr.splice(i, 1);
      }
    }
  }

  heuristic(a, b){
    // euclidean
    //let d = euclidean(a.i, a.j, b.i, b.j);

    // manhattan
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);

    return d;
  }

  // eslint-disable-next-line no-unused-vars
  euclidean(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
  }

  initActions(){
    const thisFinder = this;

    if(thisFinder.step === 1){
      thisFinder.counter = 0;

      thisFinder.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        if(e.target.classList.contains(classNames.square.square)){
        thisFinder.toggleField(e.target);
        }
      });

      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(2);
      });
    }

    else if(thisFinder.step === 2){
      thisFinder.saveField();

      thisFinder.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.toggleStart(e.target);
      });

      thisFinder.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.toggleFinish(e.target);
      });

      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(3);
      });
    }

    else if(thisFinder.step === 3){

      thisFinder.searchPath();

      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(1);
        this.clearFields();
      });
    }
  }

  saveField(){
    const thisFinder = this;
    const squares = thisFinder.element.querySelectorAll('#square');

    for(let square of squares){
      const field = {
        row: square.getAttribute('data-row'),
        col: square.getAttribute('data-col')
      };

      if(thisFinder.grid[field.row][field.col].isClicked === true){
        square.classList.add(classNames.square.activeRoad);
      }
    }
  }

  clearFields(){
    const thisFinder = this;
    const squares = thisFinder.element.querySelectorAll('#square');

    for(let square of squares){
      const field = {
        row: square.getAttribute('data-row'),
        col: square.getAttribute('data-col')
      };

      if(thisFinder.grid[field.row][field.col].isClicked === true){
        thisFinder.grid[field.row][field.col].isClicked = false;
      }
      if(thisFinder.grid[field.row][field.col].isStart === true){
        thisFinder.grid[field.row][field.col].isStart = false;
      }
      if(thisFinder.grid[field.row][field.col].isEnd === true){
        thisFinder.grid[field.row][field.col].isEnd = false;
      }
    }
  }

  toggleField(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    if(thisFinder.grid[field.row][field.col].isClicked === true){
      thisFinder.grid[field.row][field.col].isClicked = false;
      fieldElement.classList.remove(classNames.square.activeRoad);
    }
    else {
      /*const gridValues = Object.values(thisFinder.grid)
      .map(col => Object.values(col))
      .flat();

      if(gridValues.includes(true)){  //  TO DO  //  FIX ??

        const edgeFields = [];
        if(field.col > 1) edgeFields.push(thisFinder.grid[field.row][field.col-1]);
        if(field.col < 10) edgeFields.push(thisFinder.grid[field.row][field.col+1]);
        if(field.row > 1) edgeFields.push(thisFinder.grid[field.row+1][field.col]);
        if(field.row < 10) edgeFields.push(thisFinder.grid[field.row-1][field.col]);
        console.log(edgeFields);

        if(!edgeFields.includes(true)){
          alert('A new field should touch at least one that is already selected!');
          return;
        }
      }*/

      thisFinder.grid[field.row][field.col].isClicked = true;
      fieldElement.classList.add(classNames.square.activeRoad);
    }
  }

  toggleStart(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    if(thisFinder.grid[field.row][field.col].isStart === true
        &&
      fieldElement.classList.contains(classNames.square.start)
        &&
      thisFinder.counter === 1)
    {
      thisFinder.grid[field.row][field.col].isStart = false;
      fieldElement.classList.remove(classNames.square.start);
      fieldElement.classList.add(classNames.square.activeRoad);
      thisFinder.counter--;
    }
    else
    if(thisFinder.grid[field.row][field.col].isClicked === true
        &&
      fieldElement.classList.contains(classNames.square.activeRoad)
        &&
        thisFinder.counter === 0)
    {
      fieldElement.classList.remove(classNames.square.activeRoad);
      thisFinder.grid[field.row][field.col].isStart = true;
      fieldElement.classList.add(classNames.square.start);
      thisFinder.counter++;

      // STARTING POINT
      this.start = thisFinder.grid[field.row][field.col];
      this.openSet.push(this.start);
      console.log(this.start);
    }
  }

  toggleFinish(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    if(thisFinder.grid[field.row][field.col].isEnd === true
        &&
      fieldElement.classList.contains(classNames.square.end)
        &&
      thisFinder.counter === 2)
    {
      thisFinder.grid[field.row][field.col].isEnd = false;
      fieldElement.classList.remove(classNames.square.end);
      fieldElement.classList.add(classNames.square.activeRoad);
      thisFinder.counter--;
    }
    else
    if(thisFinder.grid[field.row][field.col].isClicked === true
        &&
      fieldElement.classList.contains(classNames.square.activeRoad)
        &&
      thisFinder.counter === 1)
    {
      fieldElement.classList.remove(classNames.square.activeRoad);
      thisFinder.grid[field.row][field.col].isEnd = true;
      fieldElement.classList.add(classNames.square.end);
      thisFinder.counter++;


      // END POINT
      this.end = thisFinder.grid[field.row][field.col];
      console.log(this.end);
    }
  }

  render(){
    const thisFinder = this;

    let pageData = null;
    switch(thisFinder.step){
      case 1:
        pageData = { title: 'DRAW ROUTES', btnText: 'FINISH DRAWING' };
        break;
      case 2:
        pageData = { title: 'PICK START AND FINISH', btnText: 'COMPUTE' };
        break;
      case 3:
        pageData = { title: 'THE BEST ROUTE IS...', btnText: 'START AGAIN' };
        break;
    }

    const generatedHTML = templates.finderWidget(pageData);
    thisFinder.dom = {};
    thisFinder.dom.wrapper = thisFinder.element;
    thisFinder.element.innerHTML = generatedHTML;
    thisFinder.setupGrid();
    thisFinder.initActions();
  }
}

export default Finder;
