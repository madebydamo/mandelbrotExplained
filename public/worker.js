onmessage = function(e) {
  var mandelbrot = e.data[0];
  var index = e.data[1];
  var row = mandelbrot.rows[index];
  var widthAbs;
  var heightAbs;
  var unfinished = false;
  if (mandelbrot.width > mandelbrot.height) {
    widthAbs = mandelbrot.scale * (mandelbrot.width / mandelbrot.height);
    heightAbs = mandelbrot.scale;
  } else {
    widthAbs = mandelbrot.scale;
    heightAbs = mandelbrot.scale * (mandelbrot.height / mandelbrot.width);
  }
  for (let i = 0; i < mandelbrot.width; i++) {
    if (row.iteration[i] != 0) continue;
    unfinished = true;
    var ca = canvasToRealX(widthAbs, mandelbrot.midx, i, mandelbrot.width);
    var cb = canvasToRealY(heightAbs, mandelbrot.midy, row.index, mandelbrot.height);
    var za = ca;
    var zb = cb;
    if (row.zna.lenght > i) {
      za = row.zna[i];
      zb = row.znb[i];
    }
    for (let j = 0; j < mandelbrot.iterAmount; j++) {
      var tempa = za * za - zb * zb + ca;
      var tempb = 2 * za * zb + cb;
      if (tempa * tempa + tempb * tempb > 4) {
        row.iteration[i] = row.n + j + 1;
        break;
      }
      za = tempa;
      zb = tempb;
    }
    row.zna[i] = za;
    row.znb[i] = zb;
  }
  row.n += mandelbrot.iterAmount;
  if (unfinished) {
    row.inProg = false;
  } else {
    row.inProg = true;
  }
  // console.log(row);
  postMessage(row);
}
function canvasToRealX(widthAbs, midx, x, sizeWidth) {
  return ((x / sizeWidth) * widthAbs) + (midx - (widthAbs / 2));
}
function canvasToRealY(heightAbs, midy, y, sizeHeight) {
  return - (((y / sizeHeight) * heightAbs) + (midy - (heightAbs / 2)));
}
