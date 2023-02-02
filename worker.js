var settings = null
onmessage = function(e) {
  if (settings == null) {
    console.log(e.data);
    settings = e.data;
    return;
  }
  var row = e.data;
  var widthAbs;
  var heightAbs;
  var unfinished = false;
  if (settings.width > settings.height) {
    widthAbs = settings.scale * (settings.width / settings.height);
    heightAbs = settings.scale;
  } else {
    widthAbs = settings.scale;
    heightAbs = settings.scale * (settings.height / settings.width);
  }
  for (let i = 0; i < settings.width; i++) {
    if (row.iteration[i] != 0) continue;
    unfinished = true;
    var ca = canvasToRealX(widthAbs, settings.midx, i, settings.width);
    var cb = canvasToRealY(heightAbs, settings.midy, row.index, settings.height);
    var za = ca;
    var zb = cb;
    if (row.n > 0) {
      za = row.zna[i];
      zb = row.znb[i];
    }
    for (let j = 0; j < settings.iterAmount; j++) {
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
  row.n += settings.iterAmount;
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
