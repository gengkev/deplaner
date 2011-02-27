// This is the js file where we do stuff. planeHandler.js does nothing, it just initializes everything.

var paper=Raphael("container",1100,600);
paper.image("field1.png",0,0,1100,600);
var planeImagesPreload=[];
planeImages.forEach(function(e,i,a) {
  planeImagesPreload[i]=new Image().src=e;
});


// Javascript random number generator spazzes well with this
var time=0;
var timer=setInterval(function(){time++;},1000);
function planeLaunch() {
  if(Math.random()*time/30 > 1) {
    new Plane(0,randomNum(15));
    console.log("Based on random, plane chose to launch");
  }
  else { console.log("Based on random, plane chose NOT to launch"); }
  setTimeout(planeLaunch,3000+(3000/time));
};
planeLaunch();