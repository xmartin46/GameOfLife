var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

let width = 1000;
let height = 900;

canvas.height = height;
canvas.width = width;

let nRows = 10;
let nCols = 10;

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

function drawBoard(){
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
}

drawBoard();
var array = create2DArray(nRows, nCols);

canvas.addEventListener("mousedown", getPosition, false);
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
