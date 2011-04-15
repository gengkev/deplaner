// This is the js file where we do stuff. planeHandler.js does nothing, it just initializes everything.


function resize() {
  document.getElementById("container").innerHTML="";
  var width=window.innerWidth;
  var height=window.innerHeight;
  if (width<height) {
    document.getElementById("container").style.height=Math.floor(width*6/11)+"px";
    window.height=parseInt(document.getElementById("container").style.height);
    window.width=parseInt(containerStyle.getPropertyValue("width"));
  }
  else {
    document.getElementById("container").style.width=Math.floor(parseInt(height*11/6)+"px";
    window.width=parseInt(document.getElementById("container").style.width);
    window.height=parseInt(containerStyle.getPropertyValue("height"));
  }
  planeLength=width*1/30;

}
resize();

window.onresize=function() {
  (confirm("The window cannot change its size unless you reload.\n\nDo you want to do so now?")==true)?location.reload():null;
}

function initField() {
  var paper=Raphael("container",width,height);
  paper.image("field1.png",0,0,width,height);

  //Base
  var circle1=paper.circle(width*52.9/111,height*23.8/61,width*6/174).attr("stroke","none");
  circle1.node.addEventListener("mouseover",function(){
  },false);
  var circle2=paper.rect(width*17/71,height*74/155,width*2/71,height/31).attr("stroke","none");
  var circle3=paper.rect(635,535,width*2/71,height/31).rotate(300);
}

if (location&&typeof location.search!="undefined") {
  var queryString=location.search.substring(1).split("&"); //remove ?, split by &
  var queryObject={};
  queryString.forEach(function(e,i,a) {
    var currentParam=e.split("=");
    queryObject[currentParam[0]]=currentParam[1];
  });
  if (queryObject["dev"]=="true") {
    initField();startTime();
  }
  else {
    var h1=document.createElement("h1");
    h1.appendChild(document.createTextNode("Sorry, this is not ready for public use!"));
    var refreshLink=document.createElement("span");
    refreshLink.innerHTML="If you are sure you want to continue, click here".link("?dev=true");
    document.body.removeChild(document.getElementById("container"));
    document.body.appendChild(h1);
    document.body.appendChild(refreshLink);
  }
}

function startTime() {
  // Javascript random number generator spazzes well with this
  var time=0;
  var timer=setInterval(function(){time++;},1000);
  function planeLaunch() {
    if (time==0) { setTimeout(planeLaunch,1000); return; }
    else if(randomNum()*time/10 > 1) {
      var i;
      var _planesArrayLength=planes.length;
      for (i=0;i<=planesArrayLength;i++) {
        if (typeof planes[i]==="undefined") {
          break;
        }
      }
      planes[i]=new Plane(i,0,randomNum(15));
      console.log("Based on random, plane chose to launch");
    }
    else { console.log("Based on random, plane chose NOT to launch"); }
    setTimeout(planeLaunch,5000+(10000/time));
  };
  planeLaunch();
}