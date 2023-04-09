/* eslint-disable indent */
import { classNames, select, templates } from '../settings.js';

class Finder{
  constructor(element){
    const thisFinder = this;
    thisFinder.element = element;

    thisFinder.grid = {};
    for(let row = 1; row <= 10; row++){
      thisFinder.grid[row] = {};
      for(let col = 1; col <= 10; col++){
        thisFinder.grid[row][col] = false;
      }
    }
    console.log(thisFinder.grid);

    thisFinder.step = 1;
    thisFinder.render();
  }

  changeStep(newStep){
    const thisFinder = this;

    thisFinder.step = newStep;
    thisFinder.render();
  }

  drawGrid(){
    let html = '';
    let squareHeight = 65;  //  SQUARE SIZE
    let squareWidth = 65;   //  SQUARE SIZE
    for(let row = 1; row <= 10; row++){
      for(let col = 1; col <= 10; col++){  //  GRID HEIGHT
        html += '<div id="square" class="square" data-row="' + row + '" data-col="' + col + '" style="width: ' + squareWidth + 'px; height: ' + squareHeight +'px"></div>';
      }
    }

    let grid = this.element.querySelector(select.elements.grid);
    let width = 10;  //  GRID WIDTH
    let gridWidth = width * squareWidth;
    grid.style.width = `${gridWidth}px`;
    grid.innerHTML = html;
  }

  initActions(){
    const thisFinder = this;

    if(thisFinder.step === 1){
      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(2);
      });

      thisFinder.element.querySelector(select.elements.grid).addEventListener('click', e => {
        e.preventDefault();
        if(e.target.classList.contains(classNames.square.square)){
        thisFinder.toggleField(e.target);
        }
      });
    }
    else if(thisFinder.step === 2){
      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(3);
      });
      //  TO DO  //  HOW TO PASS CLICKED ??  //  LISTENER FOR START AND FINISH
    }
    else if(thisFinder.step === 3){
      thisFinder.element.querySelector(select.elements.button).addEventListener('click', e => {
        e.preventDefault();
        thisFinder.changeStep(1);
      });
      //  TO DO  //  FIND SHORTEST PATH  //  RESET GRID
    }
  }

  toggleField(fieldElement){
    const thisFinder = this;

    const field = {
      row: fieldElement.getAttribute('data-row'),
      col: fieldElement.getAttribute('data-col')
    };

    if(thisFinder.grid[field.row][field.col]){
      thisFinder.grid[field.row][field.col] = false;
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
        if(field.row > 1) edgeFields.push(thisFinder.grid[field.row-1][field.col]);
        if(field.row > 10) edgeFields.push(thisFinder.grid[field.row+1][field.col]);
        console.log(edgeFields);

        if(!edgeFields.includes(true)){
          alert('A new field should touch at least one that is already selected!');
          return;
        }
      }*/

      thisFinder.grid[field.row][field.col] = true;
      fieldElement.classList.add(classNames.square.activeRoad);
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
    thisFinder.drawGrid();
    thisFinder.initActions();
  }
}

export default Finder;
