/* eslint-disable indent */
import { classNames, select, templates } from '../settings.js';
import Spot from './Spot.js';

class Finder {
  constructor(element){
    const thisFinder = this;

    thisFinder.element = element;

    //  GRID ------------------------------------
    thisFinder.cols = 10;
    thisFinder.rows = thisFinder.cols;
    //  1D ARRAY
    thisFinder.grid = new Array(thisFinder.cols);
    //  2D ARRAY
    for (let i = 0; i < thisFinder.cols; i++){
      thisFinder.grid[i] = new Array(thisFinder.rows);
    }
    //  SPOTS
    for (let i = 0; i < thisFinder.cols; i++){
      for (let j = 0; j < thisFinder.rows; j++){
        thisFinder.grid[i][j] = new Spot(i, j);
      }
    } // ----------------------------------------

    //  GLOBALS
    thisFinder.clicked = [];
    thisFinder.edgeFields = [];
    thisFinder.path = [];
    thisFinder.openSet = [];
    thisFinder.closedSet = [];
    thisFinder.counter = 0;
    thisFinder.start;
    thisFinder.end;
    thisFinder.gridValues = Object.values(thisFinder.grid).map(col => Object.values(col)).flat();

    //  INIT
    thisFinder.step = 1;
    thisFinder.render();
  }

  changeStep(newStep){
    const thisFinder = this;

    thisFinder.step = newStep;
    thisFinder.render();
  }

  setupGrid(){
    const thisFinder = this;

    //  NEIGHBORS
    for (let i = 0; i < thisFinder.cols; i++){
      for (let j = 0; j < thisFinder.rows; j++){
        thisFinder.grid[i][j].addNeighbors(thisFinder.grid);
      }
    }
    //  SHOW GRID
    for (let i = 0; i < thisFinder.cols; i++){
      for (let j = 0; j < thisFinder.rows; j++){
        thisFinder.grid[i][j].showGrid();
      }
    }
  }

  initActions(){
    const thisFinder = this;

    //  STEP ONE
    if (thisFinder.step === 1){

      thisFinder.counter = 0;
      thisFinder.start = undefined;
      thisFinder.end = undefined;
      thisFinder.path = [];
      thisFinder.closedSet = [];
      thisFinder.clicked = [];
      thisFinder.edgeFields = [];

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

    //  STEP TWO
    else if (thisFinder.step === 2){

      thisFinder.saveFields();

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

    //  STEP THREE
    else if (thisFinder.step === 3){

      thisFinder.saveFields();
      thisFinder.searchPath();

      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(1);
        thisFinder.clearFields();
      });
    }
  }

  saveFields(){
    const thisFinder = this;

    const squares = thisFinder.element.querySelectorAll('#square');

    for (let square of squares){
      const field = {
        row: square.getAttribute('data-row'),
        col: square.getAttribute('data-col')
      };

      if (thisFinder.grid[field.row][field.col].isClicked === true){
        square.classList.add(classNames.square.activeRoad);
      }
    }
  }

  clearFields(){
    const thisFinder = this;

    const squares = thisFinder.element.querySelectorAll('#square');

    for (let square of squares){
      const field = {
        row: square.getAttribute('data-row'),
        col: square.getAttribute('data-col')
      };

      if (thisFinder.grid[field.row][field.col].isClicked === true){
        thisFinder.grid[field.row][field.col].isClicked = false;
      }
      if (thisFinder.grid[field.row][field.col].isStart === true){
        thisFinder.grid[field.row][field.col].isStart = false;
      }
      if (thisFinder.grid[field.row][field.col].isEnd === true){
        thisFinder.grid[field.row][field.col].isEnd = false;
      }
      if (thisFinder.grid[field.row][field.col].isWall === false){
        thisFinder.grid[field.row][field.col].isWall = true;
      }
    }
  }

  toggleField(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    //  PUSH TO [EDGEFIELDS]
    if (thisFinder.clicked.length > 0){
      if (thisFinder.edgeFields.includes(thisFinder.grid[field.row][field.col])){
        for (let square of thisFinder.gridValues) {
          if (square.neighbors.includes(thisFinder.grid[field.row][field.col])){
            thisFinder.edgeFields.push(square);
          }
        }

        thisFinder.grid[field.row][field.col].isClicked = true;
        thisFinder.grid[field.row][field.col].isWall = false;
        fieldElement.classList.add(classNames.square.activeRoad);
      }
    }

    else {
      for (let square of thisFinder.gridValues){
        if (square.neighbors.includes(thisFinder.grid[field.row][field.col])){
          thisFinder.edgeFields.push(square);
        }
      }
      thisFinder.clicked.push(thisFinder.grid[field.row][field.col]);

      thisFinder.grid[field.row][field.col].isClicked = true;
      thisFinder.grid[field.row][field.col].isWall = false;
      fieldElement.classList.add(classNames.square.activeRoad);
    }
  }

  toggleStart(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    if (thisFinder.grid[field.row][field.col].isStart === true
        &&
      fieldElement.classList.contains(classNames.square.start)
        &&
      thisFinder.counter === 1)
    {
      thisFinder.grid[field.row][field.col].isStart = false;
      fieldElement.classList.remove(classNames.square.start);
      fieldElement.classList.add(classNames.square.activeRoad);
      thisFinder.counter--;

      //  REMOVE STARTING POINT
      thisFinder.start = undefined;
      thisFinder.openSet = [];
    }
    else
    if (thisFinder.grid[field.row][field.col].isClicked === true
        &&
      fieldElement.classList.contains(classNames.square.activeRoad)
        &&
        thisFinder.counter === 0)
    {
      fieldElement.classList.remove(classNames.square.activeRoad);
      thisFinder.grid[field.row][field.col].isStart = true;
      fieldElement.classList.add(classNames.square.start);
      thisFinder.counter++;

      //  SET STARTING POINT
      thisFinder.start = thisFinder.grid[field.row][field.col];
      thisFinder.openSet.push(thisFinder.start);
    }
  }

  toggleFinish(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    if (thisFinder.grid[field.row][field.col].isEnd === true
        &&
      fieldElement.classList.contains(classNames.square.end)
        &&
      thisFinder.counter === 2)
    {
      thisFinder.grid[field.row][field.col].isEnd = false;
      fieldElement.classList.remove(classNames.square.end);
      fieldElement.classList.add(classNames.square.activeRoad);
      thisFinder.counter--;

      //  REMOVE END POINT
      thisFinder.end = undefined;
    }
    else
    if (thisFinder.grid[field.row][field.col].isClicked === true
        &&
      fieldElement.classList.contains(classNames.square.activeRoad)
        &&
      thisFinder.counter === 1)
    {
      fieldElement.classList.remove(classNames.square.activeRoad);
      thisFinder.grid[field.row][field.col].isEnd = true;
      fieldElement.classList.add(classNames.square.end);
      thisFinder.counter++;

      //  SET END POINT
      thisFinder.end = thisFinder.grid[field.row][field.col];
    }
  }

  searchPath(){
    const thisFinder = this;

    while (thisFinder.openSet.length > 0){
      let lowestIndex = 0;
      for (let i = 0; i < thisFinder.openSet.length; i++){
        if (thisFinder.openSet[i].f < thisFinder.openSet[lowestIndex].f){
          lowestIndex = i;
        }
      }
      let current = thisFinder.openSet[lowestIndex];

      //  FINDING PATH
      if (current === thisFinder.end){
        let temp = current;
        thisFinder.path.push(temp);
        while (temp.previous){
          thisFinder.path.push(temp.previous);
          temp = temp.previous;
        }
        console.log('DONE!');
      }

      thisFinder.removeFromArray(thisFinder.openSet, current);
      thisFinder.closedSet.push(current);

      let neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++){
        let neighbor = neighbors[i];

        if (!thisFinder.closedSet.includes(neighbor) && !neighbor.isWall){
          let tempG = current.g + 1;
          if (thisFinder.openSet.includes(neighbor)){
            if (tempG < neighbor.g){
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            thisFinder.openSet.push(neighbor);
          }

          //  CALCULATE DISTANCE
          neighbor.h = thisFinder.heuristic(neighbor, thisFinder.end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

    //  DISPLAY RESULTS DOM
    for (let i = 0; i < thisFinder.path.length; i++){
      const pathNode = thisFinder.path[i];
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
    //  EUCLIDEAN
    //let d = euclidean(a.i, a.j, b.i, b.j);

    //  MANHATTAN
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);

    return d;
  }

  // eslint-disable-next-line no-unused-vars
  euclidean(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
  }

  render(){
    const thisFinder = this;

    let pageData = null;

    switch (thisFinder.step){
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

    console.log('---------------------------------------------------');
    console.log('path:', thisFinder.path);
    console.log('open:', thisFinder.openSet);
    console.log('closed:', thisFinder.closedSet);
    console.log('start:', thisFinder.start);
    console.log('end:', thisFinder.end);
    console.log('---------------------------------------------------');
  }
}

export default Finder;
