//Everything from cmplxSqr
var cmplxSqr = document.getElementById("complexSqr");
var ctxc = cmplxSqr.getContext("2d");
var sizeWidth = ctxc.canvas.clientWidth;
var sizeHeight = ctxc.canvas.clientHeight;
cmplxSqr.width = sizeWidth;
cmplxSqr.height = sizeHeight;

drawUnitCircle(ctxc, 0, 0, 2.5);
console.log ( ctxc );
cmplxSqr.addEventListener('mousemove', function (event) {
  ctxc.clearRect(0, 0, sizeWidth, sizeHeight)
  drawUnitCircle(ctxc, 0, 0, 2.5);
  var scale = 2.5
  var widthAbs;
  var heightAbs;
  if ( sizeWidth > sizeHeight ) {
    widthAbs = scale * ( sizeWidth / sizeHeight );
    heightAbs = scale;
  } else {
    widthAbs = scale;
    heightAbs = scale * ( sizeHeight / sizeWidth );
  }
  const rect = cmplxSqr.getBoundingClientRect();
  const x = canvasToRealX(widthAbs, 0, event.clientX - rect.left, sizeWidth);
  const y = canvasToRealY(heightAbs, 0, event.clientY - rect.top, sizeHeight);
  const xsqr = x * x - y * y;
  const ysqr = 2 * x * y;
  const xsqr_add = xsqr + x;
  const ysqr_add = ysqr + y;
  ctxc.lineWidth = 1;
  ctxc.stroke();
  ctxc.lineWidth = 2;
  //orig
  ctxc.fillStyle = "#FFCCCB";
  ctxc.beginPath();
  ctxc.moveTo(realToCanvasX(widthAbs, 0, 0, sizeWidth), realToCanvasY(heightAbs, 0, 0, sizeHeight));
  ctxc.lineTo(realToCanvasX(widthAbs, 0, x, sizeWidth), realToCanvasY(heightAbs, 0, y, sizeHeight));
  ctxc.closePath();
  ctxc.stroke();
  ctxc.beginPath();
  ctxc.arc(realToCanvasX(widthAbs, 0, x, sizeWidth), realToCanvasY(heightAbs, 0, y, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxc.closePath();
  ctxc.fill();
  ctxc.stroke();
  //sqe
  ctxc.fillStyle = "red";
  ctxc.beginPath();
  ctxc.moveTo(realToCanvasX(widthAbs, 0, 0, sizeWidth), realToCanvasY(heightAbs, 0, 0, sizeHeight));
  ctxc.lineTo(realToCanvasX(widthAbs, 0, xsqr, sizeWidth), realToCanvasY(heightAbs, 0, ysqr, sizeHeight));
  ctxc.closePath();
  ctxc.stroke();
  ctxc.beginPath();
  ctxc.arc(realToCanvasX(widthAbs, 0, xsqr, sizeWidth), realToCanvasY(heightAbs, 0, ysqr, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxc.closePath();
  ctxc.fill();
  ctxc.stroke();
  //sqr + add
  ctxc.fillStyle = "darkred";
  ctxc.beginPath();
  ctxc.moveTo(realToCanvasX(widthAbs, 0, xsqr, sizeWidth), realToCanvasY(heightAbs, 0, ysqr, sizeHeight));
  ctxc.lineTo(realToCanvasX(widthAbs, 0, xsqr_add, sizeWidth), realToCanvasY(heightAbs, 0, ysqr_add, sizeHeight));
  ctxc.closePath();
  ctxc.stroke();
  ctxc.beginPath();
  ctxc.arc(realToCanvasX(widthAbs, 0, xsqr_add, sizeWidth), realToCanvasY(heightAbs, 0, ysqr_add, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxc.closePath();
  ctxc.fill();
  ctxc.stroke();
  //legend
  ctxc.fillStyle = "#FFCCCB";
  ctxc.beginPath();
  ctxc.arc(realToCanvasX(widthAbs, 0, -1.02, sizeWidth), realToCanvasY(heightAbs, 0, 1.05, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxc.closePath();
  ctxc.fill();
  ctxc.stroke();
  ctxc.fillStyle = "black";
  ctxc.fillText("z_0", realToCanvasX(widthAbs, 0, -0.98, sizeWidth), realToCanvasY(heightAbs, 0, 1.02, sizeHeight));

  ctxc.fillStyle = "red";
  ctxc.beginPath();
  ctxc.arc(realToCanvasX(widthAbs, 0, -1.02, sizeWidth), realToCanvasY(heightAbs, 0, 0.95, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxc.closePath();
  ctxc.fill();
  ctxc.stroke();
  ctxc.fillStyle = "black";
  ctxc.fillText("z_0 squared", realToCanvasX(widthAbs, 0, -0.98, sizeWidth), realToCanvasY(heightAbs, 0, 0.92, sizeHeight));

  ctxc.fillStyle = "darkred";
  ctxc.beginPath();
  ctxc.arc(realToCanvasX(widthAbs, 0, -1.02, sizeWidth), realToCanvasY(heightAbs, 0, 0.85, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 0.03), 0, 2 * Math.PI);
  ctxc.closePath();
  ctxc.fill();
  ctxc.stroke();
  ctxc.fillStyle = "black";
  ctxc.fillText("z_1", realToCanvasX(widthAbs, 0, -0.98, sizeWidth), realToCanvasY(heightAbs, 0, 0.82, sizeHeight));
  // console.log('mousemove');
  ctxc.fillStyle = "black";
});
