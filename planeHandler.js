/*
 pathState: <path d="" class="pathState0" />
 pathState definition: 0 - no path; 1 - dragging path; 2 - path to somewhere
   3- path to landing strip
 plane entrances: 4 on each side, starting on the left (starts at 0)
 remember: 1000 by 600
*/
var planeImages=["plane1.png"];
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
  //remember to offset to the canvas - thanks to Shiraz's uncle
  pos.x -= paper.canvas.offsetLeft;
  pos.y -= paper.canvas.offsetTop;
  return pos;
}
var currentPlaneSelected=null;
var planes=new Array(1000);
function Plane(type,entrance,emergency) {
  this.type=type;
  this.entrance=entrance;
  this.emergency=emergency; //either undefined or a SVG path
  this.id=this.generateId();
  var entercoords=[0,0],otherend=[0,0];
  switch(Math.floor(this.entrance/4)) {
    case 0: //top - 0 to 3
      entercoords=[125+250*this.entrance,-40];
      otherend=[randomNum(1100),600];
      break;
    case 1: //left - 4 to 7
      entercoords=[-40,75+150*(this.entrance-4)];
      otherend=[1100,randomNum(600)];
      break;
    case 2: //bottom - 8 to 11
      entercoords=[125+250*(this.entrance-8),640];
      otherend=[randomNum(1100),-40];
      break;
    case 3: //right - 12 to 15
      entercoords=[1500,75+150*(this.entrance-12)];
      otherend=[-40,randomNum(600)];
      break;
  }
  this.path=paper.path("M"+entercoords[0]+","+entercoords[1]+"L"+otherend[0]+","+otherend[1]);
  this.path.node.setAttribute("class","pathState0");
  this.plane=paper.image(planeImages[this.type],entercoords[0],entercoords[1],40,40);
  this.plane.node.setAttribute("parentPlaneId",this.id);
  this.plane.node.onmousedown=function(e) {
    if (!e) { e=window.event; } pos=getMouseCoords(e);
    var _this=planes[Number(this.attributes.parentPlaneId.nodeValue)];
    console.log("Plane with id "+_this.id+" mouse down");
    _this.plane.stop();
    _this.plane.attr({d:"",x:pos.x,y:pos.y});
    _this.path.node.setAttribute("class","pathState1");
    currentPlaneSelected=_this.id;
    window.onmousemove=function(e){ //no work... probably
      if (!e) { e=window.event; } pos=getMouseCoords(e);
      /* We should add points to the end of the path, and hope it will 
       * automatically adjust?
       */
      var _this=planes[currentPlaneSelected];
      var d=_this.path.node.attributes.d.nodeValue;
      d=d.substring(d.lastIndexOf("L")+1).split(",",2); //array = x and y
      d[0]=Number(d[0]);d[1]=Number(d[1]); //convert to numbers
      //Pythagorean
      var l=Math.sqrt(Math.pow(pos.x-d[0],2)+Math.pow(pos.y-d[1],2));
      if (l>5) { //more than 5 pixels change
        console.log("Plane with id "+_this.id+" captured good mouse move to "+pos.x+","+pos.y+" from "+d[0]+","+d[1]+" with length "+l);
        _this.length+=l;
        _this.path.node.attributes.d.nodeValue+="L"+pos.x+","+pos.y;
      }
    };
    window.onmouseup=function(e) {
      console.log("Plane with id "+_this.id+" mouse up");
      window.onmouseup=undefined;
      if (window.onmousemove) {
      /* in some cases like we drag it over a runway it automatically ends even though the mouse is still down, in which case we will remove window.onmousemove to stop wasting energy and to tell us here */
        window.onmousemove=undefined;
        // we are going to put a little dot at the end
        _this.marker=paper.ellipse(pos.x,pos.y,2,2).attr({fill: "#f00"});
        _this.path.node.setAttribute("class","pathState2");
        window.currentPlaneSelected=null;
      }
    };
  };
  this.length=Math.sqrt(Math.pow(entercoords[0]-otherend[0],2)
    +Math.pow(entercoords[1]-otherend[1],2));
  // 50 pixels per second times 1000 (per millisecond)
  this.plane.animateAlong(this.path,Math.round(this.length*20),true,function(){
    //bounce off the edge of screen
    
  });
  console.log("Created new plane with id "+this.id+": ");
  return this;
}
Plane.prototype.remove=function() {
  this.plane.animate({opacity:0},1000,function() {
    this.remove();
  });
  this.path.remove();
  planes[this.id]=undefined;
};
Plane.prototype.generateId=function() {
  for (i=0;i<planes.length;i++) {
    if (typeof planes[i]==="undefined") {
      planes[i]=this;
      return i;
    }
  }
  if (i===1000) {
    console.error("1000 planes on field!");
    if (navigator.notification) {
      navigator.notification.alert([
        "Error",
        init,
        "You have 1000 planes on the airfield!",
        "Go back to the main menu"
      ]);
    }
    else {
      alert("Error: You have 1000 planes on the airfield!\n\nGo back to the main menu");
      init();
    }
  }
};