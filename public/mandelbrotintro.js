//Everything about the first mandelbrot image
var mandelinit = document.getElementById("mandelinit");
var ctxmi = mandelinit.getContext("2d");
var sizeWidth = ctxmi.canvas.clientWidth;
var sizeHeight = ctxmi.canvas.clientHeight;
mandelinit.width = sizeWidth;
mandelinit.height = sizeHeight;

var mandelbrot = {
  settings: {
    midx: -0.5,
    midy: 0,
    scale: 2.5,
    width: sizeWidth,
    height: sizeHeight,
    current: 0,
    iterAmount: 1000,
  },
  rows: [],
}

for (let i = 0; i < mandelbrot.settings.height; i++) {
  mandelbrot.rows[i] = {
    index: i,
    iteration: [],
    zna: [],
    znb: [],
    n: 0,
    inProg: false,
  };
  for (let j = 0; j < mandelbrot.settings.width; j++) {
    mandelbrot.rows[i].iteration[j] = 0;
  }
}

var workersmi = [];
//Generate Worker
mandelbrot.settings.current = 3;
for (let i = 0; i < 4; i++) {
  workersmi[i] = new Worker("worker.js");
  workersmi[i].postMessage(mandelbrot.settings);
  workersmi[i].onmessage = (e) => {
    var row = e.data;

    ctxmi.beginPath();
    for (let j = 0; j < mandelbrot.settings.width; j++) {
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
      ctxmi.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 255 + ")";
      ctxmi.fillRect(j, row.index, 1, 1);
    }
    ctxmi.closePath();
    ctxmi.fill();
    ctxpc.drawImage(mandelinit, 0, 0);
    drawUnitCircle(ctxpc, -0.5, 0, 2.5);
    if (mandelbrot.settings.midx == mandelbrotInteractive.settings.midx && mandelbrot.settings.midy == mandelbrotInteractive.settings.midy && mandelbrot.settings.scale == mandelbrotInteractive.settings.scale) {
      ctxm.drawImage(mandelinit, 0, 0);
      printInfo();
    }
    row.inProg = true; //1000 is enough for the static image
    mandelbrot.rows[row.index] = row;
    for (let j = 0; j < mandelbrot.settings.height - 1; j++) {
      var realIndex = (mandelbrot.settings.current + j + 1) % mandelbrot.settings.height;
      if (mandelbrot.rows[realIndex].inProg == false) {
        mandelbrot.rows[realIndex].inProg = true;
        mandelbrot.settings.current = realIndex;
        workersmi[i].postMessage(mandelbrot.rows[realIndex]);
        break;
      }
    }
  };
  mandelbrot.rows[i].inProg = true;
  workersmi[i].postMessage(mandelbrot.rows[i]);
}
