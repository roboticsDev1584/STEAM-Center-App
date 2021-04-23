var scrollTop =  window.pageYOffset || document.documentElement.scrollTop; 
var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
var iMap = document.getElementById("iMap");
var imgC = document.getElementById("imgC");
var map1Active = true;
var smallSide;
var cont=false;
var scaleAmt = 1.0;
var originalX = 0;
var originalY = 0;
var diffX = 0;
var diffY = 0;
var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
var paddingI = parseInt($(".roomToggle").css("padding"));
var fontSizeI = parseInt($(".roomToggle").css("font-size"));
var cPadding; 
var cFontSize;
var scrollToggleActive = false;
//these are flags that show which side to stop (or none if 0)
var stopLeft = 0;
var stopRight = 0;
var stopTop = 0;
var stopBottom = 0;
//these variables are the number of rooms that have a room 
//number with the prefix 'a', 'b', etc.
var aRoomNum = 23;
var bRoomNum = 0;
var dataArr;
var roomListArr;
//these variables are used to indicate if the icon popup width should be set or not
var icon1SetW = true;
var icon2SetW = true;
var icon3SetW = true;
var stopHoverTrig1 = false;
var stopHoverTrig2 = false;
var stopHoverTrig3 = false;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
} 
function stopDefault(e) {
  e.preventDefault();
}
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
function disableScroll() {
  window.addEventListener('DOMMouseScroll', stopDefault, {passive: false});
  window.addEventListener(wheelEvent, stopDefault, {passive: false});
  window.addEventListener('touchmove', stopDefault, {passive: false});
}
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', stopDefault, {passive: false});
  window.removeEventListener(wheelEvent, stopDefault, {passive: false}); 
  window.removeEventListener('touchmove', stopDefault, {passive: false});
}

fetch('https://roboticsdev1584.github.io/STEAM-Center-App/map.json').then(function(resp) {
  return resp.json();
  }).then(function(data) {
  dataArr = data.mainInfo; //this can now be indexed using [index] notation
  roomListArr = data.roomInfo2;
  try { updateClubListing(); }
  catch(err) {}//do nothing
  });
$(document).ready(function() {
$("#A001").css("left", `${5}%`);
$("#A001").css("top", `${54}%`);
$("#A002").css("left", `${10}%`);
$("#A002").css("top", `${47.5}%`);
$("#A003").css("left", `${15.25}%`);
$("#A003").css("top", `${39}%`);
$("#A006").css("left", `${36}%`);$("#A006").css("top", `${26}%`);$("#A009").css("left", `${55.25}%`);$("#A009").css("top", `${26}%`);$("#A013").css("left", `${81.5}%`);$("#A013").css("top", `${48}%`);$("#A015").css("left", `${22}%`);$("#A015").css("top", `${56}%`);$("#A016").css("left", `${32}%`);$("#A016").css("top", `${48}%`);$("#A017").css("left", `${37.6}%`);$("#A017").css("top", `${44.5}%`);$("#A018").css("left", `${52.5}%`);$("#A018").css("top", `${42}%`);$("#A019").css("left", `${60}%`);$("#A019").css("top", `${48}%`);$("#A021").css("left", `${73}%`);$("#A021").css("top", `${58}%`);$("#A023").css("left", `${87}%`);$("#A023").css("top", `${72}%`);
$("#B001").css("left", `${6.5}%`);$("#B001").css("top", `${54.5}%`);$("#B003").css("left", `${17}%`);$("#B003").css("top", `${41.5}%`);$("#B005").css("left", `${36.5}%`);$("#B005").css("top", `${27.5}%`);$("#B007").css("left", `${54}%`);$("#B007").css("top", `${27.5}%`);$("#B010").css("left", `${74.5}%`);$("#B010").css("top", `${43}%`);$("#B015").css("left", `${71.5}%`);$("#B015").css("top", `${57}%`);$("#B018").css("left", `${87}%`);$("#B018").css("top", `${73}%`);
  //this is necessary right before the organization image centering so that it always executes correctly
  sleep(20);
});

$("img").on('dragstart', function(event) {event.preventDefault();});
$('img').bind('contextmenu', function(e) {return false;}); 
$("#icon1").click(function() {
    stopHoverTrig1 = true;
});
$("#icon2").click(function() {
    stopHoverTrig2 = true;
});
$("#icon3").click(function() {
    stopHoverTrig3 = true;
});
$(".nav1").click(function() {
	iMap.src="STEAM-map-01.svg";
  $(".floorNum").text("1");
  //this is just used to clear the past class changes
  $(".nav1C").removeClass("active");
  $(".nav2C").removeClass("active");
  $(".nav1C").addClass("active");
  //this contains all of the 'a' rooms
  $(".imgC7").css("display", "block");
  //this contains all of the 'b' rooms
  $(".imgC8").css("display", "none");
  map1Active = true;
});
$(".nav2").click(function() {
	iMap.src="STEAM-map-02.svg";
  $(".floorNum").text("2");
    //this is just used to clear the past class changes
    $(".nav1C").removeClass("active");
    $(".nav2C").removeClass("active");
    $(".nav2C").addClass("active");
    $(".imgC7").css("display", "none");
    $(".imgC8").css("display", "block");
  map1Active = false;
});
$(".nav3").click(function() {
    if (!scrollToggleActive) { //turn on disable scrolling
      $(".nav3C").addClass("active");
      $(".scrollToggle").text("on");
      //scrollToggle
      disableScroll();
    }
    else { //turn off disable scrolling
      $(".nav3C").removeClass("active");
      $(".scrollToggle").text("off");
      enableScroll();
    }
    scrollToggleActive = !scrollToggleActive;
});
$(".imgC3").click(function() { //zoom in
  $(".imgC9").css("display","none");
  scaleAmt+=1.0;
  if (scaleAmt > 5.0) {
    scaleAmt = 5.0;
  }
  if (scaleAmt != 1.0){
    cPadding = ((scaleAmt + paddingI)>8)? 8: scaleAmt + paddingI;
    cFontSize = ((scaleAmt*2 + fontSizeI)>20)? 20: scaleAmt*2 + fontSizeI;
    $(".roomToggle").css("padding", `${cPadding}px`);
    $(".roomToggle").css("font-size", `${cFontSize}px`);
    $(".roomToggle").css("z-index","1");
    $(".roomToggle").css("max-width","100%");
    $("#A015").css("width","auto");
    $("#A023").css("max-width","100% !important");
    $("#B018").css("max-width","100% !important");
    var tempW;
      var tempH;
      for (var index3 = 0; index3 < dataArr.length; index3++) {
       tempW = viewWidth/118 - (viewWidth/10000);
       tempH = 4;
      if (viewWidth > 1900) {
        tempW -= 3.0;
        tempH = 7;
      }
      else if (viewWidth > 1800) {
        tempW -= 2.5;
        tempH = 7;
      }
      else if (viewWidth > 1700) {
        tempW -= 1.5;
        tempH = 7;
      }
      else if (viewWidth > 1600) {
        tempW -= 0.5;
        tempH = 7;
      }
      else if (viewWidth > 1500) {
        tempH = 7;
      }
      else if (viewWidth > 1050) {
        tempH = 6;
       }
       else if (viewWidth > 950) {
        tempH = 5;
       }
       else if (viewWidth > 850) {
        tempH = 4;
       }
       else if (viewWidth > 650) {
        tempH = 3.5;
       }
       else if (viewWidth > 550) {
        tempH = 3;
       }
       else if (viewWidth > 450) {
        tempH = 2.5;
       }
       else if (viewWidth > 0) {
        tempH = 2;
       }
        $(`#${dataArr[index3].room}`).css("left", `${(dataArr[index3].left)*scaleAmt+(iMap.getBoundingClientRect().left - imgC.getBoundingClientRect().left)/(tempW)+scaleAmt}%`);
        $(`#${dataArr[index3].room}`).css("top", `${(dataArr[index3].top)*scaleAmt+(iMap.getBoundingClientRect().top - imgC.getBoundingClientRect().top)/(tempH)}%`);
      }
  }
  iMap.style.transform = `scale(${scaleAmt})`;
  $(".imgC2").css("z-index","99");
  $(".imgC3").css("z-index","99");
  $(".imgC4").css("z-index","99");
  $(".imgC6").css("z-index","99");
  $(".imgC6Mobile").css("z-index","99");
  $(".legendC").css("z-index","99");
  $(".legendCMobile").css("z-index","99");
});
$(".imgC4").click(function() { //zoom out
  scaleAmt-=1.0;
  $(".imgC9").css("display","none");
  if (scaleAmt < 1.0) {
    scaleAmt = 1.0;
    $(".imgC9").css("display","block");
  }
  else if (scaleAmt == 1.0) {
    $(".roomToggle").css("max-width","8%");
    $(".imgC9").css("display","block");
  	iMap.style.marginLeft = `${0}px`;
    iMap.style.marginTop = `${0}px`;
    //this resets the roomToggle buttons to their initially-sized styling
    $(".roomToggle").css("padding", `${paddingI}px`);
    $(".roomToggle").css("font-size", `${fontSizeI}px`);
    for (var index3 = 0; index3 < dataArr.length; index3++) {
      $(`#${dataArr[index3].room}`).css("left", `${dataArr[index3].left}%`);
      $(`#${dataArr[index3].room}`).css("top", `${dataArr[index3].top}%`);     
    }
  }
  if (scaleAmt != 1.0) {
    $(".roomToggle").css("max-width","100%");
    $("#A023").css("max-width","100% !important");
    $("#B018").css("max-width","100% !important");
    cPadding = ((scaleAmt + paddingI)>8)? 8: scaleAmt + paddingI;
    cFontSize = ((scaleAmt*2 + fontSizeI)>20)? 20: scaleAmt*2 + fontSizeI;
    $(".roomToggle").css("padding", `${cPadding}px`);
    $(".roomToggle").css("font-size", `${cFontSize}px`);
    $(".roomToggle").css("z-index","1");
    var tempW;
      var tempH;
      for (var index3 = 0; index3 < dataArr.length; index3++) {
       tempW = viewWidth/118 - (viewWidth/10000);
       tempH = 4;
      if (viewWidth > 1900) {
        tempW -= 3.0;
        tempH = 7;
      }
      else if (viewWidth > 1800) {
        tempW -= 2.5;
        tempH = 7;
      }
      else if (viewWidth > 1700) {
        tempW -= 1.5;
        tempH = 7;
      }
      else if (viewWidth > 1600) {
        tempW -= 0.5;
        tempH = 7;
      }
      else if (viewWidth > 1500) {
        tempH = 7;
      }
      else if (viewWidth > 1050) {
        tempH = 6;
       }
       else if (viewWidth > 950) {
        tempH = 5;
       }
       else if (viewWidth > 850) {
        tempH = 4;
       }
       else if (viewWidth > 650) {
        tempH = 3.5;
       }
       else if (viewWidth > 550) {
        tempH = 3;
       }
       else if (viewWidth > 450) {
        tempH = 2.5;
       }
       else if (viewWidth > 0) {
        tempH = 2;
       }
        $(`#${dataArr[index3].room}`).css("left", `${(dataArr[index3].left)*scaleAmt+(iMap.getBoundingClientRect().left - imgC.getBoundingClientRect().left)/(tempW)+scaleAmt}%`);
        $(`#${dataArr[index3].room}`).css("top", `${(dataArr[index3].top)*scaleAmt+(iMap.getBoundingClientRect().top - imgC.getBoundingClientRect().top)/(tempH)}%`);
      }
  }
  iMap.style.transform = `scale(${scaleAmt})`;
  $(".imgC2").css("z-index","99");
  $(".imgC3").css("z-index","99");
  $(".imgC4").css("z-index","99");
  $(".imgC6").css("z-index","99");
  $(".imgC6Mobile").css("z-index","99");
  $(".legendC").css("z-index","99");
  $(".legendCMobile").css("z-index","99");
});
$(".imgC6").click(function() { //open more info bar
  $(".imgC6").css("display","none");
  $(".legendC").css("display","block");
  $(".legendC").css("z-index","99");
  $(".roomToggle").css("z-index","1");
});
$(".closeInfo").click(function() { //close more info bar
  $(".legendC").css("display","none");
  $(".imgC6").css("display","block");
});
$(".imgC6Mobile").click(function() { //open more info bar
  $(".imgC6Mobile").css("display","none");
  $(".legendCMobile").css("display","block");
  $(".legendCMobile").css("z-index","99");
  $(".roomToggle").css("z-index","1");
});
$(".closeInfoMobile").click(function() { //close more info bar
  $(".legendCMobile").css("display","none");
  $(".imgC6Mobile").css("display","block");
});
$(".imgC").on("touchstart mousedown", function(e) {
  imgC.style.height = `${imgC.offsetHeight}px`;
  cont = true;
  if (viewWidth < 821) { //if they are currently on mobile, get these coordinates
    originalX = e.originalEvent.touches[0].pageX;
    originalY = e.originalEvent.touches[0].pageY;
  }
  else {
    originalX = e.pageX;
    originalY = e.pageY;
  }
});
$("body").on("touchend mouseup", function(){
  cont = false;
});
$(".imgC").on("touchmove mousemove", function(event){
    try {
    var currentX;
    var currentY;
    if (viewWidth < 821) { //if they are currently on mobile, get these coordinates
      currentX = event.originalEvent.touches[0].pageX;
      currentY = event.originalEvent.touches[0].pageY;
    }
    else {
      currentX = event.pageX;
      currentY = event.pageY;
    }
    if (scaleAmt == 1.0) {
    	diffX = 0;
      diffY = 0;
      $(".roomToggle").css("z-index","1");
      for (var index3 = 0; index3 < dataArr.length; index3++) {
        $(`#${dataArr[index3].room}`).css("left", `${dataArr[index3].left}%`);
        $(`#${dataArr[index3].room}`).css("top", `${dataArr[index3].top}%`);
      }
    }
    else {
      $(".roomToggle").css("z-index","1");
      var tempW;
      var tempH;
      for (var index3 = 0; index3 < dataArr.length; index3++) {
       tempW = viewWidth/118 - (viewWidth/10000);
       tempH = 4;
      if (viewWidth > 1900) {
        tempW -= 3.0;
        tempH = 7;
      }
      else if (viewWidth > 1800) {
        tempW -= 2.5;
        tempH = 7;
      }
      else if (viewWidth > 1700) {
        tempW -= 1.5;
        tempH = 7;
      }
      else if (viewWidth > 1600) {
        tempW -= 0.5;
        tempH = 7;
      }
      else if (viewWidth > 1500) {
        tempH = 7;
      }
      else if (viewWidth > 1050) {
        tempH = 6;
       }
       else if (viewWidth > 950) {
        tempH = 5;
       }
       else if (viewWidth > 850) {
        tempH = 4;
       }
       else if (viewWidth > 650) {
        tempH = 3.5;
       }
       else if (viewWidth > 550) {
        tempH = 3;
       }
       else if (viewWidth > 450) {
        tempH = 2.5;
       }
       else if (viewWidth > 0) {
        tempH = 2;
       }
        $(`#${dataArr[index3].room}`).css("left", `${(dataArr[index3].left)*scaleAmt+(iMap.getBoundingClientRect().left - imgC.getBoundingClientRect().left)/(tempW)+scaleAmt}%`);
        $(`#${dataArr[index3].room}`).css("top", `${(dataArr[index3].top)*scaleAmt+(iMap.getBoundingClientRect().top - imgC.getBoundingClientRect().top)/(tempH)}%`);
      }
    }
    iMap.style.marginLeft = `${diffX}px`;
    iMap.style.marginTop = `${diffY}px`;
    if (cont && scaleAmt!=1.0) {
    //stop the map from trying to move left
    if (stopLeft == 1 && (-(originalX - currentX)/-1)<0) {}
    //stop the map from trying to move right
    else if (stopRight == 1 && (-(originalX - currentX)/-1)>0) {}
    else {diffX += -(originalX - currentX);}
    //stop the map from trying to move up
    if (stopTop == 1 && (-(originalY - currentY)/-1)<0) {}
    //stop the map from trying to move down
    else if (stopBottom == 1 && (-(originalY - currentY)/-1)>0) {}
    else {diffY += -(originalY - currentY);}
    iMap.style.marginLeft = `${diffX}px`;
    iMap.style.marginTop = `${diffY}px`;
    if ((iMap.getBoundingClientRect().left - imgC.getBoundingClientRect().left) > 0) {
        //set the trigger to make it stop moving left
        stopLeft = 1; //stop moving left
    }
    else {
      stopLeft = 0;
    }
    if ((iMap.getBoundingClientRect().right - imgC.getBoundingClientRect().right) < 0) {
        //set the trigger to make it stop moving right
        stopRight = 1; //stop moving right
    }
    else {
      stopRight = 0;
    }
    if ((iMap.getBoundingClientRect().top - imgC.getBoundingClientRect().top) > 0) {
        //set the trigger to make it stop moving up
        stopTop = 1; //stop moving up
    }
    else {
      stopTop = 0; 
    }
    if ((iMap.getBoundingClientRect().bottom - imgC.getBoundingClientRect().bottom) < 0) {
        //set the trigger to make it stop moving down
        stopBottom = 1; //stop moving down
    }
    else {
      stopBottom = 0;
    }
  }
    originalX = currentX;
    originalY = currentY;
}
catch (err) {
  //if the user hovers over the map before dataArr gets its data from 
  //map.json, then an error will be thrown- this gets rid of the error
  console.log("Don't hover over the map so soon!");
}
});
/*This is for all of the zoom map stuff*/
$("#enlarge").click(function(){
  scrollTop =  window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  			if (map1Active) {
        	$(".zoomImg").attr("src", "STEAM-map-01.svg");
        }
  			else {
        	$(".zoomImg").attr("src", "STEAM-map-02.svg");
        }
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); //this will disable scrolling
        };
        $(".zoomImgC").css({"display":"block"});
        $(".close").css({"display":"block"});
  			$("body").css({"overflow":"hidden"});
        $(".imgC2").css("z-index","1");
        $(".imgC3").css("z-index","1");
        $(".imgC4").css("z-index","1");
        $(".imgC6").css("z-index","1");
        $(".imgC6Mobile").css("z-index","1");
        $(".legendC").css("z-index","1");
        $(".legendCMobile").css("z-index","1");
     });
     $(".zoomImgC").click(function(){
        window.onscroll = function() {}; //enable scrolling
        $(".zoomImgC").css({"display":"none"});
        $(".close").css({"display":"none"});
       $("body").css({"overflow":"auto"});
       $(".legendC").css("z-index","99");
       $(".legendCMobile").css("z-index","99");
     });
     $(".close").click(function(){
        window.onscroll = function() {}; //enable scrolling
        $(".zoomImgC").css({"display":"none"});
        $(".close").css({"display":"none"});
       $("body").css({"overflow":"auto"});
       $(".legendC").css("z-index","99");
       $(".legendCMobile").css("z-index","99");
     });