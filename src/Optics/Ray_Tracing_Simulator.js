var Canvas1;
var ctx1;
var Object_Position_Log;
var OColor;
var Image_Position_Log;
var IColor;

var pix2coor = 20;
// Position Of The Object To Drag
var Ox = 200;
var Oy = 200;
var Or = 8;
// Position Of The Image To Drag
var Ix = 60;
var Iy = 200;
var Ir = 8;
// Focal Point
var F = 1;
var FLABEL = document.getElementById("FLABEL");
FLABEL.innerHTML= F.toFixed(1);
// Are we dragging?
var bDrag = false;
var WIDTH;
var HEIGHT;
// Are we showing rays/flashlight?
var boolRays = false;
var boolFlashlight=true;
var RayTraceButton = document.getElementById('RayTrace');
RayTraceButton.innerHTML="Show";
var FlashlightButton = document.getElementById("Flashlight");
FlashlightButton.innerHTML="Hide";

function Ray_Visibility() {
  boolRays = !boolRays;
  if (boolRays) {
    RayTraceButton.innerHTML="Hide";
  } else {
    RayTraceButton.innerHTML="Show";
  }
}
function Flashlight_Visibility() {
  boolFlashlight = !boolFlashlight;
  if (boolFlashlight) {
    FlashlightButton.innerHTML="Hide";
  } else {
    FlashlightButton.innerHTML="Show";
  }
}

// Increment focal length
function Down_F() {
  if ( (F>0.5) || ((F < 0) && (F > -20)) ) {
    F -= 0.5;
    F = Math.round((F + Number.EPSILON)*10)/10;
  } else if (F==0.5) {
    F = -0.5;
  }
  Focus_Form.value=F;
  FLABEL.innerHTML=F.toFixed(1);
  draw();
  recompute_image_distance();
}
function Up_F() {
  if ( (F < -0.5) || ((F > 0) && (F < 20)) ) {
    F += 0.5;
    F = Math.round((F + Number.EPSILON)*10)/10;
  } else if (F==-0.5) {
    F = 0.5;
  }
  Focus_Form.value=F;
  FLABEL.innerHTML=F.toFixed(1);
  draw();
  recompute_image_distance();
}

// Convert Pixels To Coordinates
function px_to_x(px) {return (px - 0.5*WIDTH)/pix2coor;}
function py_to_y(py) {return (0.5*HEIGHT - py)/pix2coor;}
// Convert Coordinates To Pixels
function x_to_px(x) {return (x*pix2coor + 0.5*WIDTH);}
function y_to_py(y) {return (0.5*HEIGHT - y*pix2coor);}

//----------------------
// Dealing With The Focal Point
const Focus_Form = document.getElementById('F');
F = parseFloat(document.getElementById('F').value);
FLABEL.innerHTML=F.toFixed(1)
var FColor = Focus_Form.style.color;

Focus_Form.addEventListener('change', (event) => {
  F = parseFloat(Focus_Form.value);
  if (F>20) {F=20;}
  if (F<-20) {F=-20;}
  F = Math.round((F+Number.EPSILON)*2)/2;
  Focus_Form.value=F;
  draw();
  recompute_image_distance();
  FLABEL.innerHTML=F.toFixed(1);
});
Focus_Form.addEventListener('submit', (event) => {
  F = parseFloat(Focus_Form.value);
  if (F>20) {F=20;}
  if (F<-20) {F=-20;}
  F = Math.round((F+Number.EPSILON)*2)/2;
  Focus_Form.value=F;
  draw();
  recompute_image_distance();
  FLABEL.innerHTML=F.toFixed(1);
});
//----------------------

//----------------------
// Recomputing Positions
function recompute_image_distance(){
  if (px_to_x(Ox) > 0){
    Ix = x_to_px( F * px_to_x(Ox) / (F - px_to_x(Ox) ) );
  } else {
    Ix = x_to_px( F * px_to_x(Ox) / (F + px_to_x(Ox) ) );
  }
  Iy = y_to_py( py_to_y(Oy)*px_to_x(Ix) / px_to_x(Ox) );
  Object_Position_Log.innerHTML = "Object Position: ( " + px_to_x(Ox).toFixed(2) + ", " + py_to_y(Oy).toFixed(2) + ")";
  Image_Position_Log.innerHTML = "Image Position: ( " + px_to_x(Ix).toFixed(2) + ", " + py_to_y(Iy).toFixed(2) + ")";
}

function recompute_object_distance(){
  if (F > 0) {
    if ((-F < px_to_x(Ix)) && (px_to_x(Ix) < F)){
      if (px_to_x(Ix) > 0){
        Ox = x_to_px( F * px_to_x(Ix) / (F + px_to_x(Ix) ) );
      } else {
        Ox = x_to_px( F * px_to_x(Ix) / (F - px_to_x(Ix) ) );
      }
    } else {
      if (px_to_x(Ix) > 0){
        Ox = x_to_px( F * px_to_x(Ix) / (F - px_to_x(Ix) ) );
      } else {
        Ox = x_to_px( F * px_to_x(Ix) / (F + px_to_x(Ix) ) );
      }
    }
  } else {
    if (px_to_x(Ix) > 0){
      Ox = x_to_px( F * px_to_x(Ix) / (F + px_to_x(Ix) ) );
    } else {
      Ox = x_to_px( F * px_to_x(Ix) / (F - px_to_x(Ix) ) );
    }
  }
  Oy = y_to_py( py_to_y(Iy)*px_to_x(Ox) / px_to_x(Ix) );
  Object_Position_Log.innerHTML = "Object Position: ( " + px_to_x(Ox).toFixed(2) + ", " + py_to_y(Oy).toFixed(2) + ")";
  Image_Position_Log.innerHTML = "Image Position: ( " + px_to_x(Ix).toFixed(2) + ", " + py_to_y(Iy).toFixed(2) + ")";
}
//----------------------

//----------------------
// Drawing Functions
function clear() {
  ctx1.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw_focus(){
  ctx1.beginPath();
  ctx1.arc(x_to_px(F), y_to_py(0), 5, 0, 2 * Math.PI, false);
  ctx1.arc(x_to_px(-F), y_to_py(0), 5, 0, 2 * Math.PI, false);
  ctx1.fillStyle = FColor;
  ctx1.fill();
}

function draw_axis_and_lens() {
  ctx1.beginPath();
  ctx1.moveTo(x_to_px(-20), y_to_py(0));
  ctx1.lineTo(x_to_px(20), y_to_py(0));
  ctx1.strokeStyle="#444444";
  ctx1.lineWidth=1;
  ctx1.stroke();
  ctx1.beginPath();
//  ctx1.moveTo(x_to_px(0), y_to_py(-8));
//  ctx1.lineTo(x_to_px(0), y_to_py(8));
  if (F < 0) {
    ctx1.arc(x_to_px(-50.25), y_to_py(0), 50*pix2coor, -0.05*Math.PI, 0.05*Math.PI, false);
    ctx1.arc(x_to_px(50.25), y_to_py(0), 50*pix2coor, 0.95*Math.PI, 1.05*Math.PI, false);
    ctx1.lineTo(x_to_px(-50.25 + 50*Math.cos(0.05*Math.PI) ), y_to_py(50*Math.sin(0.05*Math.PI)));
  }
  if (F > 0) {
    ctx1.arc(x_to_px(-48.75), y_to_py(0), 50*pix2coor, -0.05*Math.PI, 0.05*Math.PI, false);
    ctx1.arc(x_to_px(48.75), y_to_py(0), 50*pix2coor, 0.95*Math.PI, 1.05*Math.PI, false);
    ctx1.lineTo(x_to_px(-48.75 + 50*Math.cos(0.05*Math.PI) ), y_to_py(50*Math.sin(0.05*Math.PI)));
  }
  ctx1.fillStyle='rgb(70, 141, 232)'
  ctx1.fill();
}

function draw_image_and_object(){
  ctx1.beginPath();
  ctx1.arc(Ox, Oy, Or, 0, 2 * Math.PI, false);
  ctx1.fillStyle = OColor;
  ctx1.fill();

  ctx1.beginPath();
  ctx1.arc(Ix, Iy, Ir, 0, 2 * Math.PI, false);
  ctx1.fillStyle = IColor;
  ctx1.fill();
}

function draw_parallel_ray() {
  ctx1.beginPath();
  ctx1.moveTo(Ox,Oy);
  ctx1.lineTo(x_to_px(0),Oy);
  //
  let tmpx = -Math.sign(px_to_x(Ox))*20.0;
  let tmpy = py_to_y(Oy) + Math.sign(px_to_x(Ox))*py_to_y(Oy)*tmpx/F;
  ctx1.lineTo(x_to_px(tmpx), y_to_py(tmpy) );
  //
  if ((Oy > HEIGHT-144) || (Oy < 144)){
    ctx1.strokeStyle = '#997777';
    ctx1.lineWidth=2;
  } else {    
    ctx1.strokeStyle = '#440000';
    ctx1.lineWidth=2;
  }
  ctx1.stroke();

  if (Math.sign(px_to_x(Ix)) != Math.sign(tmpx)) {
    ctx1.beginPath();
    ctx1.moveTo(Ix,Iy);
    ctx1.lineTo(x_to_px(0), Oy);
    ctx1.strokeStyle = '#997777';
    ctx1.setLineDash([5,5]);
    ctx1.stroke();
    ctx1.setLineDash([]);
  }
}

function draw_focus_ray() {
  ctx1.beginPath();
  ctx1.moveTo(Ox,Oy);
  let tmpy = py_to_y(Oy) - py_to_y(Oy) * px_to_x(Ox) / (px_to_x(Ox) - Math.sign(px_to_x(Ox))*F);
  ctx1.lineTo(x_to_px(0), y_to_py(tmpy));
  ctx1.lineTo(x_to_px(-20*Math.sign(px_to_x(Ox))), y_to_py(tmpy));
  if ((y_to_py(tmpy) > HEIGHT-144) || (y_to_py(tmpy) < 144)){
    ctx1.strokeStyle = '#997777';
    ctx1.lineWidth=2;
  } else {    
    ctx1.strokeStyle = '#440000';
    ctx1.lineWidth=2;
  }
  ctx1.stroke();

  if (Math.sign(px_to_x(Ix)) == Math.sign(px_to_x(Ox))) {
    ctx1.beginPath();
    ctx1.moveTo(Ix,Iy);
    ctx1.lineTo(x_to_px(0), Iy);
    ctx1.strokeStyle = '#997777';
    ctx1.setLineDash([5,5]);
    ctx1.stroke();
    ctx1.setLineDash([]);
  }
}

function draw_flashlight() {
  let Lx = x_to_px(0);
//  let tmpy = py_to_y(Oy) - py_to_y(Oy) * px_to_x(Ox) / (px_to_x(Ox) - Math.sign(px_to_x(Ox))*F);
//  tmpy = y_to_py(tmpy);

  ctx1.beginPath();
  ctx1.moveTo(Ox, Oy);
  ctx1.lineTo(Lx, 144);
  //ctx1.lineTo(Lx, Oy);
  if (Math.sign(px_to_x(Ox)) != Math.sign(px_to_x(Ix))) {
    ctx1.lineTo(Ix, Iy);  
  }
  ctx1.lineTo(Lx, HEIGHT-144);
  ctx1.lineTo(Ox, Oy);
  ctx1.fillStyle='#CC888888';
  ctx1.fill();

  let FarX = 0;
  let FarY = 0;
  let FarM = 0;

  ctx1.beginPath();
  if (Math.sign(px_to_x(Ox)) != Math.sign(px_to_x(Ix))) {
    FarX = Lx + Math.sign(px_to_x(Ix))*WIDTH;

    ctx1.moveTo(Ix, Iy);
    
    FarM = (Iy - 144)/(Ix - Lx);
    FarY = FarM*(FarX - Ix) + Iy;
    ctx1.lineTo(FarX, FarY);

    FarM = (Iy - HEIGHT + 144)/(Ix - Lx);
    FarY = FarM*(FarX - Ix) + Iy;
    ctx1.lineTo(FarX, FarY);

    ctx1.lineTo(Ix, Iy);
    ctx1.fillStyle='#CC888888';
    ctx1.fill();

  } else {
    FarX = Lx - Math.sign(px_to_x(Ix))*WIDTH;

    ctx1.moveTo(Lx, 144);
    
    FarM = (Iy - 144)/(Ix - Lx);
    FarY = FarM*(FarX - Ix) + Iy;
    ctx1.lineTo(FarX, FarY);

    FarM = (Iy - HEIGHT + 144)/(Ix - Lx);
    FarY = FarM*(FarX - Ix) + Iy;
    ctx1.lineTo(FarX, FarY);

    ctx1.lineTo(Lx, HEIGHT - 144);
    ctx1.lineTo(Lx, 144);

    ctx1.lineTo(Ix, Iy);
    ctx1.fillStyle='#CC888888';
    ctx1.fill();

    ctx1.beginPath();
    ctx1.moveTo(Lx, 144);
    ctx1.lineTo(Ix,Iy);
    ctx1.lineTo(Lx, HEIGHT-144);
    ctx1.lineWidth=1;
    ctx1.strokeStyle = '#997777';
    ctx1.setLineDash([5,5]);
    ctx1.stroke();
    ctx1.setLineDash([]);

  }


}

function draw() {
  clear();

  draw_axis_and_lens();

  if (boolFlashlight) {draw_flashlight();}

  draw_image_and_object();

  if (boolRays){draw_parallel_ray();draw_focus_ray();}

  draw_focus();
}
//----------------------

//----------------------
// Initialize canvas, context, and draw refresh interval
function init() {
  Canvas1 = document.getElementById("Canvas1");
  ctx1 = Canvas1.getContext( '2d' );
  WIDTH = Canvas1.width;
  HEIGHT = Canvas1.height;
  Object_Position_Log = document.getElementById("Object_Position_Log");
  OColor = Object_Position_Log.style.color;
  Image_Position_Log = document.getElementById("Image_Position_Log");
  IColor = Image_Position_Log.style.color;
  recompute_image_distance();
  return setInterval(draw, 10);
}

init();

// Compute the distance between two points
function d(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2))
}

function MouseDragO(e){
  if (bDrag){
    Ox = e.pageX - Canvas1.offsetLeft;
    Oy = e.pageY - Canvas1.offsetTop;
    recompute_image_distance();
  }
}
function MouseDragI(e){
  if (bDrag){
    Ix = e.pageX - Canvas1.offsetLeft;
    Iy = e.pageY - Canvas1.offsetTop;
    recompute_object_distance();
    //Image_Position_Log.innerHTML = "Image Position: ( " + px_to_x(Ix).toFixed(2) + ", " + py_to_y(Iy).toFixed(2) + ")";
  }
}

// Handle Mouse Down Event
function MouseDown(e){
  // e is the mouse object
  // If within Or of (Ox,Oy) ...
  if ( d( e.pageX - Canvas1.offsetLeft, e.pageY - Canvas1.offsetTop, Ox, Oy ) < Or ){  
    // If NOT within Ir of (Ix,Iy) ...
    if (!( d( e.pageX - Canvas1.offsetLeft, e.pageY - Canvas1.offsetTop, Ix, Iy ) < Ir )){
      // Set the object position to the mouse position
      //    and set the boolean that indicates dragging
      Ox = e.pageX - Canvas1.offsetLeft;
      Oy = e.pageY - Canvas1.offsetTop;
      bDrag = true;
      // While dragging, set the mousemove to update the object position
      Canvas1.onmousemove = MouseDragO;
    }
  }  
  // If within Ir of (Ix,Iy) ...
  if ( d( e.pageX - Canvas1.offsetLeft, e.pageY - Canvas1.offsetTop, Ix, Iy ) < Ir ){
    // Set the image position to the mouse position
    //    and set the boolean that indicates dragging
    Ix = e.pageX - Canvas1.offsetLeft;
    Iy = e.pageY - Canvas1.offsetTop;
    bDrag = true;
    // While dragging, set the mousemove to update the object position
    Canvas1.onmousemove = MouseDragI;
  }
}
Canvas1.onmousedown = MouseDown;

// Handle Mouse Up Event
function MouseUp(){
  // Not dragging anymore
  bDrag = false;
  Canvas1.onmousemove = null;
}
Canvas1.onmouseup = MouseUp;