// This is the js file where we do stuff. planeHandler.js does nothing, it just initializes everything.

function resize() {
  document.getElementById("container").innerHTML="";
  var containerStyle=window.getComputedStyle(document.getElementById("container"),null);
  if (parseInt(containerStyle.getPropertyValue("width"))<parseInt(containerStyle.getPropertyValue("height"))) {
    document.getElementById("container").style.height=String(Math.floor(parseInt(containerStyle.getPropertyValue("width"))*6/11))+"px";
    window.height=parseInt(document.getElementById("container").style.height);
    window.width=parseInt(containerStyle.getPropertyValue("width"));
  }
  else {
    document.getElementById("container").style.width=String(Math.floor(parseInt(containerStyle.getPropertyValue("height"))*11/6))+"px";
    window.width=parseInt(document.getElementById("container").style.width);
    window.height=parseInt(containerStyle.getPropertyValue("height"));
  }
  planeLength=width*1/30;

}
resize();

window.onresize=function() {
  confirm("The window cannot change its size unless you reload.");
}

var paper=Raphael("container",width,height);
paper.image("field1.png",0,0,width,height);
var planeImagesPreload=[];
planeImages.forEach(function(e,i,a) {
  planeImagesPreload[i]=new Image().src=e;
});

//Base
var circle1=paper.circle(width*52.9/111,height*23.8/61,width*30/850).attr("stroke","2pt");
console.log("Width: "+width+" height: "+height)
var circle2
var circle3

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