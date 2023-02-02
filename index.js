function drawUnitCircle(ctx, midx, midy, scale) {
  var widthAbs;
  var heightAbs;
  if ( sizeWidth > sizeHeight ) {
    widthAbs = scale * ( sizeWidth / sizeHeight );
    heightAbs = scale;
  } else {
    widthAbs = scale;
    heightAbs = scale * ( sizeHeight / sizeWidth );
  }
  ctx.lineWidth = 4;
  // ctx.scale(300/sizeWidth, 150/sizeHeight);
  ctx.beginPath();
  // ctx.moveTo(00, 00);
  // ctx.lineTo(sizeWidth - 10, sizeHeight - 10);
  ctx.arc(realToCanvasX(widthAbs, midx, 0, sizeWidth), realToCanvasY(heightAbs, midy, 0, sizeHeight), realLenghtToCanvas(widthAbs, sizeWidth, 1), 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(realToCanvasX(widthAbs, midx, 0, sizeWidth), realToCanvasY(heightAbs, midy, -1.1, sizeHeight));
  ctx.lineTo(realToCanvasX(widthAbs, midx, 0, sizeWidth), realToCanvasY(heightAbs, midy, 1.1, sizeHeight));
  ctx.moveTo(realToCanvasX(widthAbs, midx, -1.1, sizeWidth), realToCanvasY(heightAbs, midy, 0, sizeHeight));
  ctx.lineTo(realToCanvasX(widthAbs, midx, 1.1, sizeWidth), realToCanvasY(heightAbs, midy, 0, sizeHeight));
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.font = realLenghtToCanvas(widthAbs, sizeWidth, 0.06) + "px Courier New";
  ctx.fillText("1 + 0i", realToCanvasX(widthAbs, midx, 1.02, sizeWidth), realToCanvasY(heightAbs, midy, 0.02, sizeHeight));
  ctx.fillText("0 + 1i", realToCanvasX(widthAbs, midx, 0.02, sizeWidth), realToCanvasY(heightAbs, midy, 1.02, sizeHeight));
  ctx.fillText("-1 + 0i", realToCanvasX(widthAbs, midx, -0.98, sizeWidth), realToCanvasY(heightAbs, midy, 0.02, sizeHeight));
  ctx.fillText("0 - 1i", realToCanvasX(widthAbs, midx, 0.02, sizeWidth), realToCanvasY(heightAbs, midy, -1.08, sizeHeight));
  ctx.closePath();
  ctx.stroke();
}
function realLenghtToCanvas(widthAbs, sizeWidth, length) {
  return ( length / widthAbs ) * sizeWidth;
}
function realToCanvasX(widthAbs, midx, realx, sizeWidth) {
  return sizeWidth * ( ( realx - ( midx - ( widthAbs / 2 ) ) ) / widthAbs )
}
function realToCanvasY(heightAbs, midy, realy, sizeHeight) {
  return sizeHeight * ( ( - realy - ( midy - ( heightAbs / 2 ) ) ) / heightAbs )
}

function canvasToRealX(widthAbs, midx, x, sizeWidth) {
  return ( ( x / sizeWidth )  * widthAbs ) + ( midx - ( widthAbs / 2 ) );
}
function canvasToRealY(heightAbs, midy, y, sizeHeight) {
  return - ( ( ( y / sizeHeight )  * heightAbs ) + ( midy - ( heightAbs / 2 ) ) );
}
