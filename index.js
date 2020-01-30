var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var buttonStart = document.getElementById('buttonStart');
var buttonStop = document.getElementById('buttonStop');
var buttonRandom = document.getElementById('buttonRandom');
var gridOn = document.getElementById('gridOn');
var fpsRange = document.getElementById('fps');

let width = 500;
let height = 500;

canvas.height = height;
canvas.width = width;

let nRows = 100;
let nCols = nRows;

var fps = 10;

var animationID;
var timeoutID;

canvas.addEventListener("mousedown", getPosition, false);

buttonStart.addEventListener('click', () => {
  start();
})

buttonStop.addEventListener('click', () => {
  stop();
})

buttonRandom.addEventListener('click', () => {
  countArray = initializeCountArray();

  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++) {
      array[i][j] = Math.random() > 0.5;
      if (array[i][j]) countArray[i][j] = Infinity;
      else countArray[i][j] = 0;
    }
  }

  singleValueY = [];
  singleValueX = [0];

  drawGrid();
  drawArray(array);
  paintCounter(countArray);
  createHistogram(countArray);
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
  if (gridOn.checked) {
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
    context.strokeStyle = "black";

    context.stroke();
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawArray(array);
  }
}

function getPosition(event) {
  var x = event.x - canvas.offsetTop;
  var y = event.y - canvas.offsetTop;

  array[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)] = !array[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)];

  if (countArray[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)] == 0) {
    countArray[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)] = Infinity;
  } else {
    countArray[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)] = 0;
  }

  if (array[Math.floor((y/height) * nRows)][Math.floor((x/width) * nCols)]) {
    context.fillStyle = "#000000";
    context.fillRect(Math.floor((x/width) * nCols) * width/nCols, Math.floor((y/height) * nRows) * height/nRows, width/nCols, height/nRows);
  } else{
    context.fillStyle = "#FFFFFF";
    context.fillRect(Math.floor((x/width) * nCols) * width/nCols + 0.5, Math.floor((y/height) * nRows) * height/nRows + 0.5, width/nCols - 1.5, height/nRows - 1.5);
  }

  paintCounter(countArray);
}

function increaseArray(array) {
  cArray = [];

  // Initialize plus array values
  cArray[0] = [];
  cArray[array.length + 1] = [];

  // Real values of matrix
  for (var i = 0; i < array.length; i++) {
        cArray[i + 1] = []
    for (var j = 0; j < array[0].length; j++) {
        cArray[i + 1][j + 1] = array[i][j];
    }
  }

  // Corners
  cArray[0][0] = array[array.length - 1][array[0].length - 1];
  cArray[0][array[0].length + 1] = array[array.length - 1][0];
  cArray[array.length + 1][0] = array[0][array[0].length - 1];
  cArray[array.length + 1][array[0].length + 1] = array[0][0];

  // Top and bottom
  for (var j = 0; j < array[0].length; j++) {
      cArray[0][j + 1] = array[array.length - 1][j];
      cArray[array.length + 1][j + 1] = array[0][j];
  }

  // Left and right
  for (var i = 0; i < array.length; i++) {
    cArray[i + 1][0] = array[i][array[0].length - 1];
    cArray[i + 1][array[0].length + 1] = array[i][0];
  }

  return cArray;
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
  var cArray = copyArray(array);
  var array = increaseArray(array);

  // Rest
  for (var i = 1; i < array.length - 1; i++) {
    for (var j = 1; j < array[i].length - 1; j++) {
      var aliveCells = array[i - 1][j - 1] +
                       array[i - 1][j] +
                       array[i - 1][j + 1] +
                       array[i][j - 1] +
                       array[i][j + 1] +
                       array[i + 1][j - 1] +
                       array[i + 1][j] +
                       array[i + 1][j + 1];

      if (!array[i][j]) { // Dead cell
        if (aliveCells == 3) {
          cArray[i - 1][j - 1] = true;
          if (countArray[i - 1][j - 1] < colours.length) countArray[i - 1][j - 1]++;
        }
      } else { // Alive cell
        if (aliveCells < 2) cArray[i - 1][j - 1] = false;
        else if (aliveCells == 2 || aliveCells == 3) {
          cArray[i - 1][j - 1] = true;
          if (countArray[i - 1][j - 1] < colours.length) countArray[i - 1][j - 1]++;
        }
        else if (aliveCells > 3) cArray[i - 1][j - 1] = false;
      }
    }
  }

  return cArray;
}

function gameLoop(timeStamp) {
  timeoutID = setTimeout(() => {
    animationID = undefined;

    array = nextTick(array);
    drawArray(array);
    drawGrid();

    paintCounter(countArray);
    createHistogram(countArray);

    start();
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

function start() {
  if (!animationID) animationID = window.requestAnimationFrame(gameLoop);
}

function stop() {
  if (animationID) {
    window.cancelAnimationFrame(animationID);
    animationID = undefined;
  }

  if (timeoutID) {
    clearTimeout(timeoutID);
  }
}



drawGrid();
var array = create2DArray(nRows, nCols);

/* ************************* STATISTICS ************************* */
var countArray = initializeCountArray();
var histogramCounter = document.getElementById('tester');
var canvasCount = document.getElementById('canvasCount');
var contextCount = canvasCount.getContext('2d');

var singleValue = document.getElementById('singleValue');
var singleValueY = [];
var singleValueX = [0];

canvasCount.height = height;
canvasCount.width = width;

let colours = ["#ffffff", "#ffe6e6", "#ffcccc", "#ffb3b3", "#ff9999", "#ff8080", "#ff6666", "#ff4d4d", "#ff3333", "#ff1a1a", "#ff0000", "#e60000", "#cc0000", "#b30000", "#990000", "#800000", "#660000", "#4d0000", "#330000", "#1a0000"];

function paintCounter(countArray) {
  for (var i = 0; i < nRows; i++) {
    for (var j = 0; j < nCols; j++) {
      if (countArray[i][j] == Infinity) {
        contextCount.fillStyle = "#000000";
      } else {
        var index = Math.floor((countArray[i][j]/(colours.length + 8)) * colours.length);
        contextCount.fillStyle = colours[index];
      }

      contextCount.fillRect(j * width/nCols, i * height/nRows, width/nCols, height/nRows);
    }
  }
}

function initializeCountArray() {
  var countArray = [];

  for (var i = 0; i < nRows; i++) {
    countArray[i] = [];
    for (var j = 0; j < nCols; j++) {
      countArray[i][j] = 0;
    }
  }

  return countArray;
}

function createHistogram(countArray) {
  var histogram = new Array(21).fill(0);
  var x = [];

  for (var i = 0; i < countArray.length; i++) {
    for (var j = 0; j <= 20; j++) {
      histogram[j] += countArray[i].filter((v) => (v === j)).length;
      x[j] = j;
    }
  }

  var trace = {
      x: x,
      y: histogram,
      type: 'bar',
    };
  var data = [trace];
  Plotly.newPlot(histogramCounter, data);



  singleValueX[singleValueX.length] = singleValueX[singleValueX.length - 1] + 1;
  singleValueY[singleValueY.length] = histogram[0];

  linePlotSingleValue();
}

function linePlotSingleValue() {
  var trace = {
    x: singleValueX,
    y: singleValueY,
    type: 'scatter'
  };

  var data = [trace];

  Plotly.newPlot(singleValue, data);
}
