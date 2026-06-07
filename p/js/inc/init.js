///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RUNS ON ONLOAD /////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mapViewport = {
	scale: 1,
	left: 0,
	top: 0
};

var screenViewport = {
	scale: 1,
	left: 0,
	top: 0
};

var overlayViewport = {
	scale: 1,
	left: 0,
	top: 0
};

var introViewport = {
	scale: 1,
	left: 0,
	top: 0
};

var transViewport = {
	scale: 1,
	left: 0,
	top: 0
};

var onscreenViewport = {
	scale: 1,
	left: 0,
	top: 0
};
var GAME_FILL_BG_URL = "graphic/grass-base.png";

var applyMapViewport = function(){
	var mapStyle = {
		transformOrigin: "0 0",
		position: "absolute"
	};
	
	mapStyle.left = mapViewport.left + "px";
	mapStyle.top = mapViewport.top + "px";
	mapStyle.transform = "scale(" + mapViewport.scale + ")";
	mapStyle["-webkit-transform"] = mapStyle.transform;

	$("map").css(mapStyle);
};

var applyScreenViewport = function(){
	var screenStyle = {
		transformOrigin: "0 0",
		position: "absolute"
	};
	
	screenStyle.left = screenViewport.left + "px";
	screenStyle.top = screenViewport.top + "px";
	screenStyle.transform = "scale(" + screenViewport.scale + ")";
	screenStyle["-webkit-transform"] = screenStyle.transform;

	$("screen").css(screenStyle);
};

var applyOverlayViewport = function(){
	if (!$("overlay").length) {
		return;
	}

	var overlayStyle = {
		transformOrigin: "0 0",
		position: "absolute",
		left: overlayViewport.left + "px",
		top: overlayViewport.top + "px",
		transform: "scale(" + overlayViewport.scale + ")",
		"-webkit-transform": "scale(" + overlayViewport.scale + ")"
	};

	// Only apply to overlays that are not already inside a scaled screen,
	// to avoid double-scaling nested credits overlays.
	$("overlay").each(function(){
		if ($(this).closest("screen").length === 0) {
			$(this).css(overlayStyle);
		}
	});
};

var applyIntroViewport = function(){
	if (!$("intro").length) {
		return;
	}

	var introStyle = {
		transformOrigin: "0 0",
		position: "absolute",
		left: introViewport.left + "px",
		top: introViewport.top + "px",
		transform: "scale(" + introViewport.scale + ")",
		"-webkit-transform": "scale(" + introViewport.scale + ")"
	};

	$("intro").css(introStyle);
};

var applyBodyViewport = function(){
	var fillScale = mapViewport.fillScale || mapViewport.scale || 1;
	var bgWidth = mobile.screen.width * fillScale;
	var bgHeight = mobile.screen.height * fillScale;
	var bgStyle = {
		backgroundImage: "url(graphic/screens/loading/background.png)",
		backgroundRepeat: "repeat",
		backgroundPosition: "center center",
		backgroundSize: bgWidth + "px " + bgHeight + "px"
	};
	$("html").css("--game-fill-image", "url(" + GAME_FILL_BG_URL + ")");


	if (mapViewport.isExtreme) {
		$("body").addClass("extreme-aspect");
	} else {
		$("body").removeClass("extreme-aspect");
	}

	$("body").css(bgStyle);
};

var applyTransViewport = function(){
	if (!$("trans").length) {
		return;
	}

	var transStyle = {
		transformOrigin: "0 0",
		position: "absolute",
		left: transViewport.left + "px",
		top: transViewport.top + "px",
		transform: "scale(" + transViewport.scale + ")",
		"-webkit-transform": "scale(" + transViewport.scale + ")"
	};

	$("trans").css(transStyle);
};

var applyOnscreenViewport = function(){
	if (!$("onscreen").length) {
		return;
	}

	var onscreenStyle = {
		transformOrigin: "0 0",
		position: "absolute",
		left: onscreenViewport.left + "px",
		top: onscreenViewport.top + "px",
		transform: "scale(" + onscreenViewport.scale + ")",
		"-webkit-transform": "scale(" + onscreenViewport.scale + ")"
	};

	$("onscreen").css(onscreenStyle);
};

var fitMapViewport = function(){
	var vv = window.visualViewport;
	var baseW = mobile.screen.width;
	var baseH = mobile.screen.height;
	var vw = Math.max(vv && vv.width ? vv.width : 0, $(window).width(), document.documentElement.clientWidth || 0);
	var vh = Math.max(vv && vv.height ? vv.height : 0, $(window).height(), document.documentElement.clientHeight || 0);

	if (!vw || !vh) {
		vw = baseW;
		vh = baseH;
	}

	var scaleX = vw / baseW;
	var scaleY = vh / baseH;
	var scale = Math.min(scaleX, scaleY);
	var fillScale = Math.max(scaleX, scaleY);
	var viewportRatio = vw / Math.max(vh, 1);
	var designRatio = baseW / baseH;
	var isExtremeAspect = (viewportRatio >= designRatio * 2.4) || (viewportRatio <= designRatio / 2.4);

	if (!isFinite(scale) || scale <= 0) {
		scale = 1;
		fillScale = 1;
	}

	if (isExtremeAspect) {
		// No clipping fallback for tiny/long layouts:
		// keep contain scale for gameplay, but still use a larger fill image scale for empty space.
		scale = Math.min(scale, Math.min(scaleX, scaleY));
		fillScale = Math.max(fillScale, 1);
	}

	$("html").css("--game-base-width", baseW + "px");
	$("html").css("--game-base-height", baseH + "px");

	var offsetX = Math.max(0, (vw - (baseW * scale)) / 2);
	var offsetY = Math.max(0, (vh - (baseH * scale)) / 2);

	mapViewport = {
		scale: scale,
		left: offsetX,
		top: offsetY,
		vw: vw,
		vh: vh,
		isExtreme: isExtremeAspect,
		fillScale: fillScale
	};
	screenViewport = {
		scale: scale,
		left: offsetX,
		top: offsetY
	};
	overlayViewport = {
		scale: scale,
		left: offsetX,
		top: offsetY
	};
	introViewport = {
		scale: scale,
		left: offsetX,
		top: offsetY
	};
	transViewport = {
		scale: scale,
		left: offsetX,
		top: offsetY
	};
	onscreenViewport = {
		scale: scale,
		left: offsetX,
		top: offsetY
	};

	$("html").css("--map-scale", scale);
	$("html").css("--map-left", offsetX + "px");
	$("html").css("--map-top", offsetY + "px");
	$("html").css("--screen-scale", scale);
	$("html").css("--screen-left", offsetX + "px");
	$("html").css("--screen-top", offsetY + "px");
	$("html").css("--overlay-scale", scale);
	$("html").css("--overlay-left", offsetX + "px");
	$("html").css("--overlay-top", offsetY + "px");
	$("html").css("--intro-scale", scale);
	$("html").css("--intro-left", offsetX + "px");
	$("html").css("--intro-top", offsetY + "px");
	$("html").css("--trans-scale", scale);
	$("html").css("--trans-left", offsetX + "px");
	$("html").css("--trans-top", offsetY + "px");
	$("html").css("--onscreen-scale", scale);
	$("html").css("--onscreen-left", offsetX + "px");
	$("html").css("--onscreen-top", offsetY + "px");
	$("html").css("--game-extreme-viewport", isExtremeAspect ? "1" : "0");
	$("html").css("--game-fill-scale", fillScale);
	$("html").css("--game-fill-width", (baseW * fillScale) + "px");
	$("html").css("--game-fill-height", (baseH * fillScale) + "px");

	applyBodyViewport();
	applyMapViewport();
	applyScreenViewport();
	applyOverlayViewport();
	applyIntroViewport();
	applyTransViewport();
	applyOnscreenViewport();
};
$(window).ready(function(){
	
	//Make sure no navigation is found on iPhone
	setTimeout( function(){ window.scrollTo(0, 1); }, 50 );

	fitMapViewport();
	$(window).on("resize orientationchange", fitMapViewport);

	//initiate touch functions
	touch.init();
	
	audio.build()
	
	jQuery.fn.exists = function(){return this.length>0;}
	

})