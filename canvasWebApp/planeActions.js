// This is the js file where we do stuff. planeHandler.js does nothing, it just initializes everything.

function resize() {
  var containerStyle=window.getComputedStyle(canvas.canvas,null);
  if (parseInt(containerStyle.getPropertyValue("width"))<parseInt(containerStyle.getPropertyValue("height"))) {
    canvas.canvas.style.height=String(Math.floor(parseInt(containerStyle.getPropertyValue("width"))*6/11))+"px";
    window.height=parseInt(canvas.canvas.style.height);
    window.width=parseInt(containerStyle.getPropertyValue("width"));
  }
  else {
    canvas.canvas.style.width=String(Math.floor(parseInt(containerStyle.getPropertyValue("height"))*11/6))+"px";
    window.width=parseInt(canvas.canvas.style.width);
    window.height=parseInt(containerStyle.getPropertyValue("height"));
  }
  planeLength=width/30;

}
resize();

window.onresize=resize;

paper.image("field1.png",0,0,width,height);

//Base
var circle1=paper.circle(width*52.9/111,height*23.8/61,width*6/174).attr("stroke","none");
circle1.node.addEventListener("mouseover",function(){

},false);
var circle2=paper.rect(40,40,70,50);
var circle3;

// Javascript random number generator spazzes well with this
var time=0;
var timer=setInterval(function(){time++;},1000);
function planeLaunch() {
  if(randomNum()*time/10 > 1) {
    new Plane(0,randomNum(15));
    console.log("Based on random, plane chose to launch");
  }
  else { console.log("Based on random, plane chose NOT to launch"); }
  setTimeout(planeLaunch,5000+(10000/time));
};
planeLaunch();