/*
 pathState: <path d="" class="pathState0" />
 pathState definition: 0 - no path; 1 - dragging path; 2 - path to somewhere
   3- path to landing strip
 plane entrances: 4 on each side, starting on the left (starts at 0)
*/
var planeImages=["plane1.png"];
function randomNum(range) {
  if (!range) return Math.random();
  else return Math.floor(Math.random()*(range+1));
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
var planes=new Array();
function Plane(type,entrance,emergency) {
  this.type=type;
  this.entrance=entrance;
  this.emergency=emergency; //either undefined or a SVG path
  for (var i=0;i<=planes.length;i++) {
    if (typeof planes[i]==="undefined") {
      planes[i]=this;
      this.id=i;
    }
  }
  if (i<20) alert("Wawawa!!!! You have 20 planes!!!!")
  var entercoords=[0,0],otherend=[0,0];
  switch(Math.floor(this.entrance/4)) {
    case 0: //top - 0 to 3
      entercoords=[width/8+width/4*this.entrance,-1*planeLength];
      otherend=[randomNum(width),height+planeLength];
      break;
    case 1: //left - 4 to 7
      entercoords=[-1*planeLength,height/8+height/4*(this.entrance-4)];
      otherend=[width+planeLength,randomNum(height)];
      break;
    case 2: //bottom - 8 to 11
      entercoords=[width/8+width/4*(this.entrance-8),height+planeLength];
      otherend=[randomNum(width),-1*planeLength];
      break;
    case 3: //right - 12 to 15
      entercoords=[width+planeLength,height/8+height/4*(this.entrance-12)];
      otherend=[-1*planeLength,randomNum(height)];
      break;
  }
  this.path=paper.path("M"+entercoords[0]+","+entercoords[1]+"L"+otherend[0]+","+otherend[1]);
  this.path.node.setAttribute("class","pathState0");
  this.plane=paper.image(planeImages[this.type],entercoords[0],entercoords[1],planeLength,planeLength);
  this.plane.node.parentPlaneId=this.id;
  this.plane.node.onmousedown=function(e) {
    if (!e) { e=window.event; } pos=getMouseCoords(e);
    var _this=planes[this.parentPlaneId];
    console.log("Plane with id "+_this.id+" mouse down");
    _this.plane.stop();
    _this.plane.attr({d:"",x:pos.x,y:pos.y});
    _this.plane.node.className+=" pathState1";
    currentPlaneSelected=_this.id;
    window.onmousemove=function(e){ //no work... probably
      if (!e) { e=window.event; } pos=getMouseCoords(e);
      // pos.x+=planeLength/2;pos.y+=planeLength/2; //offset to get the cursor on the plane center
      /* We should add points to the end of the path, and hope it will 
       * automatically adjust?
       */
      var _this=planes[currentPlaneSelected];
      var d=_this.path.node.attributes.d.nodeValue;
      d=d.substring(d.lastIndexOf("L")+1).split(",",2); //array = x and y
      d[0]=Number(d[0]);d[1]=Number(d[1]); //convert to numbers
      //Pythagorean Theorum!!!!!
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
        _this.marker=paper.ellipse(pos.x,pos.y,width/600,width/600).attr({fill: "#f00"});
        _this.path.node.className+=" pathState2";
        _this.plane.attr("stroke","none");
        window.currentPlaneSelected=null;
      }
    };
  };
  this.length=Math.sqrt(Math.pow(entercoords[0]-otherend[0],2)
    +Math.pow(entercoords[1]-otherend[1],2));
  // 50 pixels per second times 1000 (per millisecond)
  this.plane.animateAlong(this.path,Math.round(this.length*20),true,bouncePlane);
  console.log("Created new plane with id "+this.id+": ");
  return this;
}
function bouncePlane() {
  var _this=planes[this.parentPlaneId];
  var d=_this.path.node.attributes.d.nodeValue;
  d=parsePath(d);
  var newc={x:0,y:0};
  // wait, where are we bouncing?
  if (d[1].x==width+planeLength||d[1].x==planeLength/-1) { //right or left
    newc.x= 
  }
  else if (d[1].y==height+planeLength||d[1].y==planeLength/-1) { //bottom or top
    
  }
  _this.path.remove();
  _this.path=paper.path("M"+end[0]+","+end[1]+"L"+newc[0]+","+newc[1]);
  _this.length=Math.sqrt(Math.pow(end[0]-newc[0],2)
    +Math.pow(end[1]-newc[1],2));
  // 50 pixels per second times 1000 (per millisecond)
  var newBounceside=(bounceside+2)%4;
  _this.plane.animateAlong(_this.path,Math.round(_this.length*20),true,bouncePlane);
  console.log("Bounced plane with id "+_this.id);

}
function parsePath(path) {
  if (typeof path!="string") throw new Error("Cannot parse non-string path");
  path=path.substring(1);
  path=path.split(" L");
  var newPath=[];
  path.forEach(function(e,i,a) {
    var coords=e.split(",",2);
    var xy={x:Number(coords[0]),y:Number(coords[1])};
    newPath.push(xy);
  });
  return newPath;
}
/*
function extendPlane() {
  var path=parsePath(this.path.node.attributes["d"]);
  if (path.length!=2) alert("Error!");
  var newc=[];
  newc[0]=path[1].x+(path[1].x-path[0].x);
  newc[1]=path[1].y+(path[1].y-path[0].y);
  this.length=Math.sqrt(Math.pow(newc[0]-path[1].x,2)
    +Math.pow(newc[1]-path[1].y,2));
  this.plane.animateAlong(this.path,Math.round(this.length*20),true,extendPlane);
} */
Plane.prototype.remove=function() {
  this.plane.animate({opacity:0},1000,function() {
    this.remove();
  });
  this.path.remove();
  planes[this.id]=undefined;
};