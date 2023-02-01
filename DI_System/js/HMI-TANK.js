//here you should add the function from the tutorial
//How to Draw Charts Using JavaScript and HTML5 Canvas
//...
//
//#region  create tag
// var _val = new Object();
// var canhoa = new Object();

function customTag(tagName, fn) {
  document.createElement(tagName);
  //find all the tags occurrences (instances) in the document
  var tagInstances = document.getElementsByTagName(tagName);

  //for each occurrence run the associated function
  for (var i = 0; i < tagInstances.length; i++) {
    fn(tagInstances[i]);
  }
}

function PiechartTag(element) {
  //add the canvas where to draw the piechart
  var canvas = document.createElement("canvas");
  canhoa = canvas;

  // element.cuongkodddol = '123';
  //get the width and height from the custom tag attributesv
  canvas.width = element.attributes.width.value;
  canvas.height = element.attributes.height.value;
  // var _Value = '0';
  var Coloron = "gold";
  var Coloroff = "black";

  try {
    _val = element.attributes.value.value;
    Coloron = element.attributes.Oncolor.value;
    Coloroff = element.attributes.Offcolor.value;
  } catch (error) {}
  element.duytran = new Hieunv(70, canvas, Coloron, Coloroff);
  // canvas. = 5000;
  element.appendChild(canvas);

  //drawPieChart(canvas, _val, Coloron, Coloroff);
  element.duytran.setValue = 3000;
}
//#endregion
class Hieunv {
  constructor(height, ele, Oncolor, Offcolor) {
    this.val = height;
    this.canvas = ele;
    this.Oncolor = Oncolor;
    this.Offcolor = Offcolor;
  }
  get getValue() {
    return this.val;
  }
  set setValue(val) {
    this.val = val / 100;
    drawTANK(this.canvas, this.val, this.Oncolor, this.Offcolor);
  }
}

customTag("HMI-TANK", PiechartTag);

//#region risgister
function drawTANK(can, va, color1, color2) {
  var canvas = can;
  var w = canvas.width;
  var h = canvas.height;
  var _va = va;
  var Oncolor = color1;
  var Offcolor = color2;
  //  var ctx = canvas.getContext('2d');
  //  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");

  // Create a linear gradient
  // The start gradient point is at x=20, y=0
  // The end gradient point is at x=220, y=0
  var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

  // Add three color stops
  gradient.addColorStop(0, "#626567");
  gradient.addColorStop(0.5, "#CACFD2");
  gradient.addColorStop(1, "#626567");

  // Set the fill style and draw a rectangle

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw boder
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "black";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  //  ctx.globalAlpha = 1;
  ctx.fillStyle = Oncolor;
  ctx.fillRect(
    (3 * canvas.width) / 100,
    (30 * canvas.height) / 150,
    canvas.width - (6 * canvas.width) / 100,
    canvas.height - (35 * canvas.height) / 150
  );

  //level
  ctx.fillStyle = Offcolor;
  ctx.fillRect(
    (3 * canvas.width) / 100,
    (30 * canvas.height) / 150,
    canvas.width - (6 * canvas.width) / 100,
    canvas.height -
      (35 * canvas.height) / 150 -
      (_va / 100) * (canvas.height - (35 * canvas.height) / 150)
  );

  ctx.fillStyle = "white";
  ctx.fillRect(
    (15 * canvas.width) / 100,
    (6 * canvas.height) / 150,
    canvas.width - (30 * canvas.width) / 100,
    (18 * canvas.height) / 150 /*max:canvas.height - 35*/
  );
  // Background data %
  // ctx.fillStyle = "black";

  ctx.fillRect(
    (16 * canvas.width) / 100,
    (7 * canvas.height) / 150,
    canvas.width - (32 * canvas.width) / 100,
    (16 * canvas.height) / 150 /*max:canvas.height - 35*/
  );

  //border
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.rect(
    (3 * canvas.width) / 100,
    (30 * canvas.height) / 150,
    canvas.width - (6 * canvas.width) / 100,
    canvas.height - (35 * canvas.height) / 150
  );
  ctx.stroke();

  // custom data %
  // ctx.fillStyle = "gold";
  // ctx.font =
  //   "bold " + (canvas.height - (35 * canvas.height) / 150) / 7 + "px Digital-7"; //15 * canvas.width / 100
  // ctx.fillText(
  //   _va.toFixed(2) + " %",
  //   (30 * canvas.width) / 100,
  //   (20 * canvas.height) / 150
  // );

  // Create gradient
  // var grd = ctx.createLinearGradient(0, 0, 200, 0);
  //grd.addColorStop(0, "red");
  //grd.addColorStop(1, "white");

  // Fill with gradient
  //  ctx.fillStyle = grd;
  //  ctx.fillRect(10, 10, 150, 80);

  //vẽ ảnh
  // const image = new Image(60, 45); // Using optional size for image
  //  image.onload = drawImageActualSize; // Draw when image has loaded

  // Load an image of intrinsic size 300x227 in CSS pixels
  // image.src = '../Control/img/tank.png'; //D:\Project Hieunv\nghiên cứu\web\web\Control\img\tank.png

  //  function drawImageActualSize() {
  // Use the intrinsic size of image in CSS pixels for the canvas element
  //  canvas.width = this.naturalWidth;
  //  canvas.height = this.naturalHeight;

  // Will draw the image as 300x227, ignoring the custom size of 60x45
  // given in the constructor
  // ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

  // To use the custom size we'll have to specify the scale parameters
  // using the element's width and height properties - lets draw one
  // on top in the corner:
  // ctx.drawImage(this, 0, 0, this.width, this.height);
  //}//vẽ ảnh
}

//#endregion
