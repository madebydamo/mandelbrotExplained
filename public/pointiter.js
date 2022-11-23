//Everything from pointiter
var pointiter = document.getElementById("pointiter");
var ctxp = pointiter.getContext("2d");
var sizeWidth = ctxp.canvas.clientWidth;
var sizeHeight = ctxp.canvas.clientHeight;
pointiter.width = sizeWidth;
pointiter.height = sizeHeight;

drawUnitCircle(ctxp, 0, 0, 2.5);
pointiter.addEventListener('mousemove', function(event) {
  ctxp.clearRect(0, 0, sizeWidth, sizeHeight)
  drawUnitCircle(ctxp, 0, 0, 2.5);
  var scale = 2.5
  var widthAbs;
  var heightAbs;
  if (sizeWidth > sizeHeight) {
    widthAbs = scale * (sizeWidth / sizeHeight);
    heightAbs = scale;
  } else {
    widthAbs = scale;
    heightAbs = scale * (sizeHeight / sizeWidth);
  }
  const rect = pointiter.getBoundingClientRect();
  const x = canvasToRealX(widthAbs, 0, event.clientX - rect.left, sizeWidth);
  const y = canvasToRealY(heightAbs, 0, event.clientY - rect.top, sizeHeight);
  var nextx = x;
  var nexty = y;
  var intensity = 0;
  anim = function() {
    if (intensity >= 256) return;
    var tempx = nextx * nextx - nexty * nexty + x;
    var tempy = 2 * nextx * nexty + y;
    ctxp.beginPath();
    ctxp.moveTo(realToCanvasX(widthAbs, 0, nextx, sizeWidth), realToCanvasY(heightAbs, 0, nexty, sizeHeight));
    ctxp.lineTo(realToCanvasX(widthAbs, 0, tempx, sizeWidth), realToCanvasY(heightAbs, 0, tempy, sizeHeight));
    ctxp.closePath();
    ctxp.stroke();
    ctxp.lineWidth = 2;
    ctxp.fillStyle = "#" + componentToHex(( intensity / 256 ) * 59 + 196) + "0000";
    ctxp.beginPath();
    ctxp.arc(realToCanvasX(widthAbs, 0, tempx, sizeWidth), realToCanvasY(heightAbs, 0, tempy, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
    ctxp.closePath();
    ctxp.fill();
    ctxp.stroke();
    ctxp.fillStyle = "black";
    nextx = tempx;
    nexty = tempy;
    intensity += 5;
    requestAnimationFrame(anim);
  };
  requestAnimationFrame(anim);
  ctxp.beginPath();
  ctxp.fillStyle = "#c40000";
  ctxp.arc(realToCanvasX(widthAbs, 0, x, sizeWidth), realToCanvasY(heightAbs, 0, y, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxp.closePath();
  ctxp.fill();
  ctxp.stroke();

  // console.log('mousemove');
});

function componentToHex(c) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
