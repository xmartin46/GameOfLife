var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var buttonStart = document.getElementById('buttonStart');
var buttonRandom = document.getElementById('buttonRandom');
var gridOn = document.getElementById('gridOn');
var fpsRange = document.getElementById('fps');

let width = 1000;
let height = 900;

canvas.height = height;
canvas.width = width;

let nRows = 100;
let nCols = nRows;

var fps = 10;

canvas.addEventListener("mousedown", getPosition, false);
buttonStart.addEventListener('click', () => {
  window.requestAnimationFrame(gameLoop);
})
buttonRandom.addEventListener('click', () => {
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++) {
      array[i][j] = Math.random() > 0.5;
    }
  }

  drawArray(array);
})
gridOn.addEventListener('click', () => {
  drawGrid();
})
fpsRange.addEventListener('mouseup', function() {
    fps = this.value;
});

function create2DArray(width, height) {
  array = []
  for (var i = 0; i < width; i++) {
    array[i] = [];
    for (var j = 0; j < height; j++) {
      array[i][j] = false;
    }
  }

  return array
}
function drawGrid(){
    var mX = 0;
    var mY = 0;
    for (var x = 0; x <= width; x += width/nCols) {
        context.moveTo(mX + x, 0);
        context.lineTo(mX + x, height);
        context.lineWidth = 1;
    }

    for (var x = 0; x <= height; x += height/nRows) {
        context.moveTo(0, mY + x);
        context.lineTo(width, mY + x);
        context.lineWidth = 1;
    }

    if (gridOn.checked) context.strokeStyle = "black";
    else context.strokeStyle = "white";

    context.stroke();
}
function getPosition(event) {
  var x = event.x - canvas.offsetTop;
  var y = event.y - canvas.offsetTop;

  array[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)] = !array[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)];

  if (array[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)]) {
    context.fillStyle = "#000000";
    context.fillRect(Math.floor((x/width) * nCols) * width/nCols, Math.floor((y/height) * nRows) * height/nRows, width/nCols, height/nRows);
  } else{
    context.fillStyle = "#FFFFFF";
    context.fillRect(Math.floor((x/width) * nCols) * width/nCols + 0.5, Math.floor((y/height) * nRows) * height/nRows + 0.5, width/nCols - 1.5, height/nRows - 1.5);
  }
}
function copyArray(array) {
  cArray = [];

  for (var i = 0; i < array.length; i++) {
    cArray[i] = array[i].slice();
  }

  return cArray;
}
function nextTick(array) {
  /* RULES
     1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
     2. Any live cell with two or three live neighbours lives on to the next generation.
     3. Any live cell with more than three live neighbours dies, as if by overpopulation.
     4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  */
  cArray = copyArray(array);

  // Rest
  for (var i = 1; i < array.length - 1; i++) {
    for (var j = 1; j < array[i].length - 1; j++) {
      var aliveCells = array[i - 1][j - 1] + array[i - 1][j] + array[i - 1][j + 1] + array[i][j - 1] + array[i][j + 1] + array[i + 1][j - 1] + array[i + 1][j] + array[i + 1][j + 1];
      if (!array[i][j]) {
        // Dead cell
        if (aliveCells == 3) cArray[i][j] = true;
      } else {
        // Alive cell
        if (aliveCells < 2) cArray[i][j] = false;
        else if (aliveCells == 2 || aliveCells == 3) cArray[i][j] = true;
        else if (aliveCells > 3) cArray[i][j] = false;
      }
    }
  }

/*
  // Left
  for (var i = 1; i < array.length - 1; i++) {
    var aliveCells = array[i - 1][array[0].length - 1] + array[i - 1][0] + array[i - 1][1] + array[i][array[0].length - 1] + array[i][1] + array[i + 1][array[0].length - 1] + array[i + 1][0] + array[i + 1][1];
    if (!array[i][0]) {
      // Dead cell
      if (aliveCells == 3) cArray[i][0] = true;
    } else {
      // Alive cell
      if (aliveCells < 2) cArray[i][0] = false;
      else if (aliveCells == 2 || aliveCells == 3) cArray[i][0] = true;
      else if (aliveCells > 3) cArray[i][0] = false;
    }
  }
  // Right
  for (var i = 1; i < array.length - 1; i++) {
    var aliveCells = array[i - 1][array[0].length - 2] + array[i - 1][array[0].length - 1] + array[i - 1][0] + array[i][array[0].length - 2] + array[i][0] + array[i + 1][array[0].length - 2] + array[i + 1][array[0].length - 1] + array[i + 1][0];
    if (!array[i][0]) {
      // Dead cell
      if (aliveCells == 3) cArray[i][0] = true;
    } else {
      // Alive cell
      if (aliveCells < 2) cArray[i][0] = false;
      else if (aliveCells == 2 || aliveCells == 3) cArray[i][0] = true;
      else if (aliveCells > 3) cArray[i][0] = false;
    }
  }
  // Top
  for (var j = 1; j < array[0].length - 1; j++) {
    var aliveCells = array[array.length - 1][j - 1] + array[array.length - 1][j] + array[array.length - 1][j + 1] + array[0][j - 1] + array[0][j + 1] + array[1][j - 1] + array[1][j] + array[1][j + 1];
    if (!array[0][j]) {
      // Dead cell
      if (aliveCells == 3) cArray[0][j] = true;
    } else {
      // Alive cell
      if (aliveCells < 2) cArray[0][j] = false;
      else if (aliveCells == 2 || aliveCells == 3) cArray[0][j] = true;
      else if (aliveCells > 3) cArray[0][j] = false;
    }
  }
  // Bottom
  for (var j = 1; j < array[0].length - 1; j++) {
    var aliveCells = array[array.length - 2][j - 1] + array[array.length - 2][j] + array[array.length - 2][j + 1] + array[array.length - 1][j - 1] + array[array.length - 1][j + 1] + array[0][j - 1] + array[0][j] + array[0][j + 1];
    if (!array[0][j]) {
      // Dead cell
      if (aliveCells == 3) cArray[0][j] = true;
    } else {
      // Alive cell
      if (aliveCells < 2) cArray[0][j] = false;
      else if (aliveCells == 2 || aliveCells == 3) cArray[0][j] = true;
      else if (aliveCells > 3) cArray[0][j] = false;
    }
  }

  // (0, 0)
  var aliveCells = array[array.length - 1][array[0].length - 1] + array[array.length - 1][0] + array[array.length - 1][1] + array[0][array[0].length - 1] + array[0][1] + array[1][array[0].length - 1] + array[1][0] + array[1][1];
  if (!array[0][0]) {
    // Dead cell
    if (aliveCells == 3) cArray[0][0] = true;
  } else {
    // Alive cell
    if (aliveCells < 2) cArray[0][0] = false;
    else if (aliveCells == 2 || aliveCells == 3) cArray[0][0] = true;
    else if (aliveCells > 3) cArray[0][0] = false;
  }

  // (N, 0)
  var aliveCells = array[array.length - 2][array[0].length - 1] + array[array.length - 2][0] + array[array.length - 2][1] + array[array.length - 1][array[0].length - 1] + array[array.length - 1][1] + array[0][array[0].length - 1] + array[0][0] + array[0][1];
  if (!array[array.length - 1][0]) {
    // Dead cell
    if (aliveCells == 3) cArray[array.length - 1][0] = true;
  } else {
    // Alive cell
    if (aliveCells < 2) cArray[array.length - 1][0] = false;
    else if (aliveCells == 2 || aliveCells == 3) cArray[array.length - 1][0] = true;
    else if (aliveCells > 3) cArray[array.length - 1][0] = false;
  }

  // (0, N)
  var aliveCells = array[array.length - 1][array[0].length - 2] + array[array.length - 1][array[0].length - 1] + array[array.length - 1][0] + array[0][array[0].length - 2] + array[0][0] + array[1][array[0].length - 2] + array[1][array[0].length - 1] + array[1][0];
  if (!array[0][array[0].length - 1]) {
    // Dead cell
    if (aliveCells == 3) cArray[0][array[0].length - 1] = true;
  } else {
    // Alive cell
    if (aliveCells < 2) cArray[0][array[0].length - 1] = false;
    else if (aliveCells == 2 || aliveCells == 3) cArray[0][array[0].length - 1] = true;
    else if (aliveCells > 3) cArray[0][array[0].length - 1] = false;
  }

  // (N, N)
  var aliveCells = array[array.length - 2][array[0].length - 2] + array[array.length - 2][array[i].length - 1] + array[array.length - 2][0] + array[array.length - 1][array[0].length - 2] + array[array.length - 1][0] + array[0][array[0].length - 2] + array[0][array[0].length - 1] + array[0][0];
  if (!array[array.length - 1][array[0].length - 1]) {
    // Dead cell
    if (aliveCells == 3) cArray[array.length - 1][array[0].length - 1] = true;
  } else {
    // Alive cell
    if (aliveCells < 2) cArray[array.length - 1][array[0].length - 1] = false;
    else if (aliveCells == 2 || aliveCells == 3) cArray[array.length - 1][array[0].length - 1] = true;
    else if (aliveCells > 3) cArray[array.length - 1][array[0].length - 1] = false;
  }
*/

  return cArray;
}
function gameLoop(timeStamp) {
  setTimeout(() => {
    drawGrid();

    array = nextTick(array);
    drawArray(array);

    window.requestAnimationFrame(gameLoop)
  }, 1000/fps);
}
function drawArray(array) {
  for (var i = 0; i < nRows; i++) {
    for (var j = 0; j < nCols; j++) {
      if (array[i][j]) {
        context.fillStyle = "#000000";
        context.fillRect(j * width/nCols, i * height/nRows, width/nCols, height/nRows);
      } else {
        context.fillStyle = "#FFFFFF";
        context.fillRect(j * width/nCols + 0.5, i * height/nRows + 0.5, width/nCols - 1.5, height/nRows - 1.5);
      }
    }
  }
}

drawGrid();
var array = create2DArray(nRows, nCols);
