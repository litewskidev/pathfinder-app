/* eslint-disable indent */
import { classNames, select, templates } from '../settings.js';
import Spot from './Spot.js';

class Finder {
  constructor(element){
    this.element = element;

    // GRID ------------------------------------
    this.cols = 10;
    this.rows = this.cols;
    // 1D ARRAY
    this.grid = new Array(this.cols);
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
    // ------------------------------------------

    // GLOBALS
    this.closedSet = [];
    this.path = [];
    this.openSet = [];
    this.start;
    this.end;
    this.clicked = [];
    this.edgeFields = [];
    this.gridValues = Object.values(this.grid).map(col => Object.values(col)).flat();

    // INIT
    this.counter = 0;
    this.step = 1;
    this.render();
  }

  changeStep(newStep){
    this.step = newStep;
    this.render();
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
  }

  initActions(){
    // STEP ONE
    if (this.step === 1){

      this.counter = 0;
      this.start = undefined;
      this.end = undefined;
      this.path = [];
      this.closedSet = [];
      this.clicked = [];
      this.edgeFields = [];

      this.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        if(e.target.classList.contains(classNames.square.square)){
        this.toggleField(e.target);
        }
      });

      this.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        this.changeStep(2);
      });
    }

    // STEP TWO
    else if (this.step === 2){

      this.saveFields();

      this.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        this.toggleStart(e.target);
      });

      this.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        this.toggleFinish(e.target);
      });

      this.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        this.changeStep(3);
      });
    }

    // STEP THREE
    else if (this.step === 3){

      this.saveFields();
      this.searchPath();

      this.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        this.changeStep(1);
        this.clearFields();
      });
    }
  }

  saveFields(){
    const squares = this.element.querySelectorAll('#square');

    for (let square of squares){
      const field = {
        row: square.getAttribute('data-row'),
        col: square.getAttribute('data-col')
      };

      if (this.grid[field.row][field.col].isClicked === true){
        square.classList.add(classNames.square.activeRoad);
      }
    }
  }

  clearFields(){
    const squares = this.element.querySelectorAll('#square');

    for (let square of squares){
      const field = {
        row: square.getAttribute('data-row'),
        col: square.getAttribute('data-col')
      };

      if (this.grid[field.row][field.col].isClicked === true){
        this.grid[field.row][field.col].isClicked = false;
      }
      if (this.grid[field.row][field.col].isStart === true){
        this.grid[field.row][field.col].isStart = false;
      }
      if (this.grid[field.row][field.col].isEnd === true){
        this.grid[field.row][field.col].isEnd = false;
      }
      if (this.grid[field.row][field.col].isWall === false){
        this.grid[field.row][field.col].isWall = true;
      }
    }
  }

  toggleField(fieldElement){

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };
    // PUSH TO [EDGEFIELDS]
    if (this.clicked.length > 0){
      if (this.edgeFields.includes(this.grid[field.row][field.col])){
        for (let square of this.gridValues) {
          if (square.neighbors.includes(this.grid[field.row][field.col])){
            this.edgeFields.push(square);
          }
        }

        this.grid[field.row][field.col].isClicked = true;
        this.grid[field.row][field.col].isWall = false;
        fieldElement.classList.add(classNames.square.activeRoad);
      }
    }

    else {
      for (let square of this.gridValues){
        if (square.neighbors.includes(this.grid[field.row][field.col])){
          this.edgeFields.push(square);
        }
      }
      this.clicked.push(this.grid[field.row][field.col]);

      this.grid[field.row][field.col].isClicked = true;
      this.grid[field.row][field.col].isWall = false;
      fieldElement.classList.add(classNames.square.activeRoad);
    }
  }

  toggleStart(fieldElement){
    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };
    /*  REMOVING START POINT
    if (this.grid[field.row][field.col].isStart === true
        &&
      fieldElement.classList.contains(classNames.square.start)
        &&
      this.counter === 1)
    {
      this.grid[field.row][field.col].isStart = false;
      fieldElement.classList.remove(classNames.square.start);
      fieldElement.classList.add(classNames.square.activeRoad);
      this.counter--;

      // REMOVE STARTING POINT
      this.start = undefined;
      this.openSet = [];
    }
    else
    */
    if (this.grid[field.row][field.col].isClicked === true
        &&
      fieldElement.classList.contains(classNames.square.activeRoad)
        &&
        this.counter === 0)
    {
      fieldElement.classList.remove(classNames.square.activeRoad);
      this.grid[field.row][field.col].isStart = true;
      fieldElement.classList.add(classNames.square.start);
      this.counter++;

      // SET STARTING POINT
      this.start = this.grid[field.row][field.col];
      this.openSet.push(this.start);
    }
  }

  toggleFinish(fieldElement){
    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };
    /*  REMOVING END POINT
    if (this.grid[field.row][field.col].isEnd === true
        &&
      fieldElement.classList.contains(classNames.square.end)
        &&
      this.counter === 2)
    {
      this.grid[field.row][field.col].isEnd = false;
      fieldElement.classList.remove(classNames.square.end);
      fieldElement.classList.add(classNames.square.activeRoad);
      this.counter--;

      // REMOVE END POINT
      this.end = undefined;
    }
    else
    */
    if (this.grid[field.row][field.col].isClicked === true
        &&
      fieldElement.classList.contains(classNames.square.activeRoad)
        &&
      this.counter === 1)
    {
      fieldElement.classList.remove(classNames.square.activeRoad);
      this.grid[field.row][field.col].isEnd = true;
      fieldElement.classList.add(classNames.square.end);
      this.counter++;

      // SET END POINT
      this.end = this.grid[field.row][field.col];
    }
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
        console.log('DONE!');
      }

      this.removeFromArray(this.openSet, current);
      this.closedSet.push(current);

      let neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++){
        let neighbor = neighbors[i];

        if (!this.closedSet.includes(neighbor) && !neighbor.isWall){
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

  render(){
    let pageData = null;
    switch (this.step){
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
    this.dom = {};
    this.dom.wrapper = this.element;
    this.element.innerHTML = generatedHTML;
    this.setupGrid();
    this.initActions();

    console.log('---------------------------------------------------');
    console.log('path:', this.path);
    console.log('open:', this.openSet);
    console.log('closed:', this.closedSet);
    console.log('start:', this.start);
    console.log('end:', this.end);
    console.log('---------------------------------------------------');
  }
}

export default Finder;
