var mandel = document.getElementById("mandel");
var ctxm = mandel.getContext("2d");
var sizeWidth = ctxm.canvas.clientWidth;
var sizeHeight = ctxm.canvas.clientHeight;
mandel.width = sizeWidth;
mandel.height = sizeHeight;

var mandelbrotInteractive = {
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

for (let i = 0; i < mandelbrotInteractive.settings.height; i++) {
  mandelbrotInteractive.rows[i] = {
    index: i,
    iteration: [],
    zna: [],
    znb: [],
    n: 0,
    inProg: false,
  };
  for (let j = 0; j < mandelbrotInteractive.settings.width; j++) {
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
  if (mandelbrotInteractive.settings.width > mandelbrotInteractive.settings.height) {
    widthAbs = mandelbrotInteractive.settings.scale * (mandelbrotInteractive.settings.width / mandelbrotInteractive.settings.height);
    heightAbs = mandelbrotInteractive.settings.scale;
  } else {
    widthAbs = mandelbrotInteractive.settings.scale;
    heightAbs = mandelbrotInteractive.settings.scale * (mandelbrotInteractive.settings.height / mandelbrotInteractive.settings.width);
  }
  const realstartx = canvasToRealX(widthAbs, mandelbrotInteractive.settings.midx, pointEnter.x, mandelbrotInteractive.settings.width)
  const realendx = canvasToRealX(widthAbs, mandelbrotInteractive.settings.midx, x, mandelbrotInteractive.settings.width)
  const realstarty = canvasToRealX(heightAbs, mandelbrotInteractive.settings.midy, pointEnter.y, mandelbrotInteractive.settings.height)
  const realendy = canvasToRealX(heightAbs, mandelbrotInteractive.settings.midy, y, mandelbrotInteractive.settings.height)
  mandelbrotInteractive.settings.midx = (realstartx + realendx) / 2;
  mandelbrotInteractive.settings.midy = (realstarty + realendy) / 2;
  if (Math.abs(realstartx - realendx) / widthAbs > Math.abs(realstarty - realendy) / heightAbs) {
    mandelbrotInteractive.settings.scale = Math.abs(realstarty - realendy);
  } else {
    mandelbrotInteractive.settings.scale = Math.abs(realstartx - realendx);
  }
  for (let i = 0; i < mandelbrotInteractive.settings.height; i++) {
    mandelbrotInteractive.rows[i] = {
      index: i,
      iteration: [],
      zna: [],
      znb: [],
      n: 0,
      inProg: false,
    };
    for (let j = 0; j < mandelbrotInteractive.settings.width; j++) {
      mandelbrotInteractive.rows[i].iteration[j] = 0;
    }
  }
  pointEnter = null;
  startcalc();
});

mandel.addEventListener("mousedown", (event) => {
  console.log(event.button);
  if (event.button == 2) return;
  if (event.button == 1) {
    event.preventDefault();
    for (let i = 0; i < workersmi.length; i++) {
      workersmi[i].terminate();
    };
    mandelbrotInteractive.settings.scale *= 2;
    for (let i = 0; i < mandelbrotInteractive.settings.height; i++) {
      mandelbrotInteractive.rows[i] = {
        index: i,
        iteration: [],
        zna: [],
        znb: [],
        n: 0,
        inProg: false,
      };
      for (let j = 0; j < mandelbrotInteractive.settings.width; j++) {
        mandelbrotInteractive.rows[i].iteration[j] = 0;
      }
    }
    startcalc();
    return;
  }
  const rect = mandel.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  pointEnter = { x: x, y: y };
  image = ctxm.getImageData(0, 0, mandelbrotInteractive.settings.width, mandelbrotInteractive.settings.height);
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
  };
  for (let i = 0; i < mandelbrotInteractive.settings.height; i++) {
    mandelbrotInteractive.rows[i] = {
      index: i,
      iteration: [],
      zna: [],
      znb: [],
      n: 0,
      inProg: false,
    };
    for (let j = 0; j < mandelbrotInteractive.settings.width; j++) {
      mandelbrotInteractive.rows[i].iteration[j] = 0;
    }
  }
  startcalc();
});

function startcalc() {

  //Generate Worker
  mandelbrotInteractive.settings.current = 7;
  for (let i = 0; i < 8; i++) {
    workersmi[i] = new Worker("worker.js");
    workersmi[i].postMessage(mandelbrotInteractive.settings);
    workersmi[i].onmessage = (e) => {
      var row = e.data;

      ctxm.clearRect(0, row.index, mandelbrotInteractive.settings.width, 1);
      ctxm.beginPath();
      for (let j = 0; j < mandelbrotInteractive.settings.width; j++) {
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
      printInfo();

      mandelbrotInteractive.rows[row.index] = row;
      for (let j = 0; j < mandelbrotInteractive.settings.height - 1; j++) {
        var realIndex = (mandelbrotInteractive.settings.current + j + 1) % mandelbrotInteractive.settings.height;
        if (!mandelbrotInteractive.rows[realIndex].inProg) {
          mandelbrotInteractive.rows[realIndex].inProg = true;
          mandelbrotInteractive.settings.current = realIndex;
          workersmi[i].postMessage(mandelbrotInteractive.rows[realIndex]);
          break;
        }
      }
    };
    mandelbrotInteractive.rows[i].inProg = true;
    workersmi[i].postMessage(mandelbrotInteractive.rows[i]);
  }
}

function printInfo() {
  var widthAbs;
  var heightAbs;
  var width;
  var height;
  if (mandelbrotInteractive.settings.width > mandelbrotInteractive.settings.height) {
    width = mandelbrotInteractive.settings.scale * (mandelbrotInteractive.settings.width / mandelbrotInteractive.settings.height);
    height = mandelbrotInteractive.settings.scale;
    widthAbs = mandelbrot.settings.scale * (mandelbrotInteractive.settings.width / mandelbrotInteractive.settings.height);
    heightAbs = mandelbrot.settings.scale;
  } else {
    width = mandelbrotInteractive.settings.scale;
    height = mandelbrotInteractive.settings.scale * (mandelbrotInteractive.settings.height / mandelbrotInteractive.settings.width);
    widthAbs = mandelbrot.settings.scale;
    heightAbs = mandelbrot.settings.scale * (mandelbrotInteractive.settings.height / mandelbrotInteractive.settings.width);
  }
  widthAbs = widthAbs * 1.5;
  heightAbs = heightAbs * 1.5;
  var dif = realLenghtToCanvas(widthAbs, sizeWidth, 0.1);
  ctxm.font = realLenghtToCanvas(widthAbs, sizeWidth, 0.06) + "px Courier New";
  ctxm.fillStyle = "#808080";
  ctxm.beginPath();
  ctxm.fillRect(realLenghtToCanvas(widthAbs, sizeWidth, 0.08), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 15 * dif, 4 * dif);
  ctxm.closePath();
  ctxm.fillStyle = "white";
  ctxm.fillText("Middle point x: " + mandelbrotInteractive.settings.midx, dif, dif);
  ctxm.fillText("Middle point y: " + mandelbrotInteractive.settings.midy, dif, 2 * dif);
  ctxm.fillText("Width: " + width, dif, 3 * dif);
  ctxm.fillText("Height: " + height, dif, 4 * dif);
}
