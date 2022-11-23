//Everything from pointitercolor
var pointiterc = document.getElementById("pointitercolor");
var ctxpc = pointiterc.getContext("2d");
var sizeWidth = ctxpc.canvas.clientWidth;
var sizeHeight = ctxpc.canvas.clientHeight;
pointiterc.width = sizeWidth;
pointiterc.height = sizeHeight;

drawUnitCircle(ctxpc, -0.5, 0, 2.5);
pointiterc.addEventListener('mousemove', function(event) {
  ctxpc.clearRect(0, 0, sizeWidth, sizeHeight)
  ctxpc.drawImage(mandelinit, 0, 0);
  drawUnitCircle(ctxpc, -0.5, 0, 2.5);
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
  const rect = pointiterc.getBoundingClientRect();
  const x = canvasToRealX(widthAbs, -0.5, event.clientX - rect.left, sizeWidth);
  const y = canvasToRealY(heightAbs, 0, event.clientY - rect.top, sizeHeight);
  var nextx = x;
  var nexty = y;
  var intensity = 5;
  anim = function() {
    if (intensity >= 256) return;
    var tempx = nextx * nextx - nexty * nexty + x;
    var tempy = 2 * nextx * nexty + y;
    ctxpc.beginPath();
    ctxpc.moveTo(realToCanvasX(widthAbs, -0.5, nextx, sizeWidth), realToCanvasY(heightAbs, 0, nexty, sizeHeight));
    ctxpc.lineTo(realToCanvasX(widthAbs, -0.5, tempx, sizeWidth), realToCanvasY(heightAbs, 0, tempy, sizeHeight));
    ctxpc.closePath();
    ctxpc.stroke();
    ctxpc.lineWidth = 2;
    ctxpc.fillStyle = "#" + componentToHex(( intensity / 256 ) * 59 + 196) + "0000";
    ctxpc.beginPath();
    ctxpc.arc(realToCanvasX(widthAbs, -0.5, tempx, sizeWidth), realToCanvasY(heightAbs, 0, tempy, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
    ctxpc.closePath();
    ctxpc.fill();
    ctxpc.stroke();
    ctxpc.fillStyle = "black";
    nextx = tempx;
    nexty = tempy;
    intensity += 5;
    requestAnimationFrame(anim);
  };
  requestAnimationFrame(anim);
  ctxpc.beginPath();
  ctxpc.fillStyle = "#c40000";
  ctxpc.arc(realToCanvasX(widthAbs, -0.5, x, sizeWidth), realToCanvasY(heightAbs, 0, y, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxpc.closePath();
  ctxpc.fill();
  ctxpc.stroke();

  // console.log('mousemove');
});

function componentToHex(c) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
