/*
 pathState definition: 0 - no path; 1 - dragging path; 2 - path to somewhere
   3- path to landing strip
 plane entrances: 4 on each side, starting on the left (starts at 0)
 remember: 1000 by 600
*/
function randomNum(range) {
 return Math.floor(Math.random()*(range+1));
}
function getMouseCoords(e) {
 var pos={x:0,y:0};
 if (e.pageX||e.pageY) {
   pos.x=e.pageX;
   pos.y=e.pageY;
 }
 else if (e.clientX||e.clientY) {
   pos.x=e.clientX+document.body.scrollLeft
     +document.documentElement.scrollLeft;
   pos.y=e.clientY+document.body.scrollTop
     +document.documentElement.scrollTop;
 }
 return pos;
}
var paper=Raphael("container",1100,600);
paper.image("field1.png",0,0,1100,600);
var planeImages=["plane1.png","plane2.png","plane3.png"];
var planes=new Array(1000);
function Plane(type,entrance,emergency) {
 this.type=type;
 this.entrance=entrance;
 this.emergency=emergency; //either undefined or a SVG path
 this.id=this.generateId();
}
Plane.prototype.launch=function() {
 switch(Math.floor(this.entrance/4)) {
   case 0: //top - 0 to 3
     var entrance=[125+250*this.entrance,-40];
     var otherend=[randomNum(1100),600];
     break;
   case 1: //left - 4 to 7
     var entrance=[-40,75+150*(this.entrance-4)];
     var otherend=[1100,randomNum(600)];
     break;
   case 2: //bottom - 8 to 11
     var entrance=[125+250*(this.entrance-8),640];
     var otherend=[randomNum(1100),0];
     break;
   case 3: //right - 12 to 15
     var entrance=[1500,75+150*(this.entrance-12)];
     var otherend=[0,randomNum(600)];
     break;
 }
 this.path=paper.path("M"+entrance[0]+","+entrance[1]+"L"+otherend[0]+","+otherend[1]).attr({stroke:"none"});
 this.pathState=0;
 console.log(paper);
 this.plane=paper.image(planeImages[this.type],entrance[0],entrance[1],40,40);
 this.plane.node.onmousedown=function(e) {
   window.onmousemove=function(e){
     if (!e) e=window.event;pos=getMouseCoords(e);
   };
 }
 this.plane.node.onmouseup=function(e) {
   if (!e) e=window.event;pos=getMouseCoords(e);
   if (window.onmousemove) { //in some cases like we drag it over a runway it automatically ends even though the mouse is still down, in which case we will remove window.onmousemove to stop wasting energy and to tell us here
     window.onmousemove=undefined;
     // we are going to put a little dot at the end
     this.marker=paper.ellipse(pos.x,pos.y,2,2).attr({
       fill: "#f00"
     });
   }
 }
 this.plane.animateAlong(this.path,30000,true,function() {
   //either land the plane or draw a new path to follow, which is either going to be bouncing off the edge or at the end of a user written path
 });
}
Plane.prototype.remove=function() {

}
Plane.prototype.generateId=function() {
 for (i=0;i<planes.length;i++) {
   if (typeof planes[i]=="undefined") {
     planes[i]=this;
     return i;
     break;
   }
 }
 if (i==1000) {
   console.error("1000 planes on field!");
   if (navigator.notification)
     navigator.notification.alert([
       "Error",
       "You have 1000 planes on the airfield!",
       "Go back to the main menu"
     ]);
   else
     alert("Error: You have 1000 planes on the airfield!\n\nGo back to the main menu");
   init();
 }
}