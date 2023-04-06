import { templates } from '../settings.js';

class Finder{
  constructor(element){
    const thisFinder = this;
    thisFinder.render(element);
    thisFinder.initGrid();
  }

  initGrid(){
    const thisFinder = this;

    let gridSizeX = 10;  //  GRID SIZE
    let gridSizeY = gridSizeX;

    thisFinder.drawGrid(gridSizeX, gridSizeY);
  }

  drawGrid(height, width){
    const thisFinder = this;

    let gridMatrix = [];
    let grid = document.getElementById('finder__grid');
    let squareSizeHeight = 65;  //  SQUARE SIZE
    let squareSizeWidth = 65;
    
    let gridWidth = width * squareSizeWidth + width * 2;
    grid.style.width = `${gridWidth}px`;

    for(let h = 0; h < height; h++){
      gridMatrix.push([]);

      for(let w = 0; w < width; w++){
        let square = document.createElement('div');
        square.classList.add('square');

        square.style.height = `${squareSizeHeight}px`;
        square.style.width = `${squareSizeWidth}px`;

        square.dataset.h = h;
        square.dataset.w = w;
        square.addEventListener('click', thisFinder.squareClick);

        grid.appendChild(square);
        gridMatrix[h].push(square);
      }
    }
  }

  squareClick(event){
    const thisFinder = this;
    thisFinder.selected;

    if(thisFinder.selected === undefined){
      let element = event.target;
      thisFinder.selected = element;
      element.classList.add('clicked');
    } else {
      thisFinder.selected.classList.remove('clicked');
      thisFinder.selected = undefined;
    }
  }

  clearPath(){
    for(let element of document.querySelectorAll('.path')){
      element.classList.remove('.path');
    }
  }

  render(element){
    const thisFinder = this;

    const generatedHTML = templates.finderWidget();
    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;
    element.innerHTML = generatedHTML;
  }
}

export default Finder;
