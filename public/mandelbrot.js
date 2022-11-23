var mandel = document.getElementById("mandel");
var ctxm = mandel.getContext("2d");
var sizeWidth = ctxm.canvas.clientWidth;
var sizeHeight = ctxm.canvas.clientHeight;
mandel.width = sizeWidth;
mandel.height = sizeHeight;

var mandelbrotInteractive = {
  midx: -0.5,
  midy: 0,
  scale: 2.5,
  width: sizeWidth,
  height: sizeHeight,
  rows: [],
  current: 0,
  iterAmount: 1000,
}

for (let i = 0; i < mandelbrotInteractive.height; i++) {
  mandelbrotInteractive.rows[i] = {
    index: i,
    iteration: [],
    zna: [],
    znb: [],
    n: 0,
    inProg: false,
  };
  for (let j = 0; j < mandelbrotInteractive.width; j++) {
    mandelbrotInteractive.rows[i].iteration[j] = 0;
  }
}

var workersmi = [];
var pointEnter = null;
var image = null;

mandel.addEventListener("mouseup", (event) => {
  if (pointEnter == null) return;
  for (let i = 0; i < workersmi.length; i++) {
    workersmi[i].terminate();
  }
  const rect = mandel.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  var widthAbs;
  var heightAbs;
  if (mandelbrotInteractive.width > mandelbrotInteractive.height) {
    widthAbs = mandelbrotInteractive.scale * (mandelbrotInteractive.width / mandelbrotInteractive.height);
    heightAbs = mandelbrotInteractive.scale;
  } else {
    widthAbs = mandelbrotInteractive.scale;
    heightAbs = mandelbrotInteractive.scale * (mandelbrotInteractive.height / mandelbrotInteractive.width);
  }
  const realstartx = canvasToRealX(widthAbs, mandelbrotInteractive.midx, pointEnter.x, mandelbrotInteractive.width)
  const realendx = canvasToRealX(widthAbs, mandelbrotInteractive.midx, x, mandelbrotInteractive.width)
  const realstarty = canvasToRealX(heightAbs, mandelbrotInteractive.midy, pointEnter.y, mandelbrotInteractive.height)
  const realendy = canvasToRealX(heightAbs, mandelbrotInteractive.midy, y, mandelbrotInteractive.height)
  mandelbrotInteractive.midx = (realstartx + realendx) / 2;
  mandelbrotInteractive.midy = (realstarty + realendy) / 2;
  if (Math.abs(realstartx - realendx) / widthAbs > Math.abs(realstarty - realendy) / heightAbs) {
    mandelbrotInteractive.scale = Math.abs(realstarty - realendy);
  } else {
    mandelbrotInteractive.scale = Math.abs(realstartx - realendx);
  }
  for (let i = 0; i < mandelbrotInteractive.height; i++) {
    mandelbrotInteractive.rows[i] = {
      index: i,
      iteration: [],
      zna: [],
      znb: [],
      n: 0,
      inProg: false,
    };
    for (let j = 0; j < mandelbrotInteractive.width; j++) {
      mandelbrotInteractive.rows[i].iteration[j] = 0;
    }
  }
  pointEnter = null;
  startcalc();
});

mandel.addEventListener("mousedown", (event) => {
  if (event.button == 2) return;
  const rect = mandel.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  pointEnter = { x: x, y: y };
  image = ctxm.getImageData(0, 0, mandelbrotInteractive.width, mandelbrotInteractive.height);
});
mandel.addEventListener("mouseleave", (event) => {
  pointEnter = null;
});
mandel.addEventListener("mousemove", (event) => {
  if (pointEnter != null) {
    const rect = mandel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctxm.putImageData(image, 0, 0);
    ctxm.strokeStyle = "white";
    ctxm.strokeRect(pointEnter.x, pointEnter.y, x - pointEnter.x, y - pointEnter.y);
  }
});
mandel.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  for (let i = 0; i < workersmi.length; i++) {
    workersmi[i].terminate();
  };
  mandelbrotInteractive = {
    midx: -0.5,
    midy: 0,
    scale: 2.5,
    width: sizeWidth,
    height: sizeHeight,
    rows: [],
    current: 0,
    iterAmount: 1000,
  };
  for (let i = 0; i < mandelbrotInteractive.height; i++) {
    mandelbrotInteractive.rows[i] = {
      index: i,
      iteration: [],
      zna: [],
      znb: [],
      n: 0,
      inProg: false,
    };
    for (let j = 0; j < mandelbrotInteractive.width; j++) {
      mandelbrotInteractive.rows[i].iteration[j] = 0;
    }
  }
  startcalc();
});

function startcalc() {

  //Generate Worker
  mandelbrotInteractive.current = 7;
  for (let i = 0; i < 8; i++) {
    workersmi[i] = new Worker("worker.js");
    workersmi[i].onmessage = (e) => {
      var row = e.data;

      ctxm.clearRect(0, row.index, mandelbrotInteractive.width, 1);
      ctxm.beginPath();
      for (let j = 0; j < mandelbrotInteractive.width; j++) {
        var r;
        var g;
        var b;
        if (row.iteration[j] == 0) {
          r = 0;
          g = 0;
          b = 0;
        } else {
          var iter = row.iteration[j];
          r = Math.round(255 * Math.sin((iter + 0.088) / 13 * 2 * Math.PI));
          g = Math.round(255 * Math.cos((iter + 13.172) / 17 * 2 * Math.PI));
          b = Math.round(255 * Math.sin((iter + 0.925) / 23 * 2 * Math.PI));
        }
        ctxm.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 255 + ")";
        ctxm.fillRect(j, row.index, 1, 1);
      }
      ctxm.closePath();
      ctxm.fill();

      mandelbrotInteractive.rows[row.index] = row;
      for (let j = 0; j < mandelbrotInteractive.height - 1; j++) {
        var realIndex = (mandelbrotInteractive.current + j + 1) % mandelbrotInteractive.height;
        if (!mandelbrotInteractive.rows[realIndex].inProg) {
          mandelbrotInteractive.rows[realIndex].inProg = true;
          mandelbrotInteractive.current = realIndex;
          workersmi[i].postMessage([mandelbrotInteractive, realIndex]);
          break;
        }
      }
    };
    mandelbrotInteractive.rows[i].inProg = true;
    workersmi[i].postMessage([mandelbrotInteractive, i]);
  }
}
