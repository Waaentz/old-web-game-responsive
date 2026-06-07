///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TOUCH OBJECT ///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var touch = {
	
	isSliding: false,
	trackTrail:[],
	slideOnUp:true,
	trailLimit:3,
	powerDisable:false,
	
	data:{
		mouseDownCords:[],
		mouseUpCords:[],
		downFuncs:[],
		upFuncs:[],
		moveFuncs:[],
		holdFuncs:[],
		slideDownFuncs:[],
		slideUpFuncs:[],
		slideLeftFuncs:[],
		slideRightFuncs:[],
		leftEdgeSlideFuncs:[]
	},
	
	down:function(func){
		
		if(typeof func == "function"){
			touch.data.downFuncs.push(func);
		}
	},
	
	up:function(func){
		if(typeof func == "function"){
			touch.data.upFuncs.push(func);
		}
	},
	
	move:function(func){
		if(typeof func == "function"){
			touch.data.moveFuncs.push(func);
		}
	},
	
	slideDown:function(func){
		if(typeof func == "function"){
			touch.data.slideDownFuncs.push(func);
		}
	},
	
	slideUp:function(func){
		if(typeof func == "function"){
			touch.data.slideUpFuncs.push(func);
		}
	},
	
	slideLeft:function(func){
		if(typeof func == "function"){
			touch.data.slideLeftFuncs.push(func);
		}
	},
	
	slideRight:function(func){
		if(typeof func == "function"){
			touch.data.slideRightFuncs.push(func);
		}
	},
	
	leftEdgeSlide:function(func){
		if(typeof func == "function"){
			touch.data.leftEdgeSlideFuncs.push(func);
		}
	},
	
	hold:function(func){
		if(typeof func == "function"){
			touch.data.holdFuncs.push(func);
		}
	},
	
	onHold:function(func){
		if(typeof func == "function"){
			touch.data.holdFuncs.push(func);
		}
	},
	
	runFuncs:function(funcArrayName){
		$(funcArrayName).each(function(i, func){
			func();
		});
	},
	
	activateTrackTrail:function(trail){
		
		//check direction
		var x = trail[trail.length-1][0] - trail[0][0];
		var y = trail[trail.length-1][1] - trail[0][1];
		
		touch.isSliding = false;
		
		
		//If screen is touched but no movement has been done
		if(x==0 && y==0){
			return false;
		}
		
		
		//Activate left edge slide functions
		var downX = (touch.data.mouseDownCords && touch.data.mouseDownCords.gameX !== undefined)
			? touch.data.mouseDownCords.gameX
			: touch.data.mouseDownCords.pageX;
		if(downX < 60 && ( (x>=0 && y>=0 && x>=y) || (x>=0 && y<=0 && x>=(-y)) )){
			touch.runFuncs(touch.data.leftEdgeSlideFuncs);
		}
		
		//SlideDown 
		if( (x>=0 && y>=0 && y>=x) || (x<=0 && y>=0 && y>=(-x))){
			touch.runFuncs(touch.data.slideDownFuncs);
		
		//Slide Up
		}else if ( (x<=0 && y<0 && y<=x) || (x>=0 && y<=0 && y<=(-x))) {
			touch.runFuncs(touch.data.slideUpFuncs);
		
		//Slide Right
		}else if ( (x>=0 && y>=0 && x>=y) || (x>=0 && y<=0 && x>=(-y))) {
			touch.runFuncs(touch.data.slideRightFuncs);
		
		//Slide Left
		}else if ( (x<=0 && y<=0 && x<=y) || (x<=0 && y>=0 && x<=(-y))) {
			touch.runFuncs(touch.data.slideLeftFuncs);
		}
	},
	
	resetSlide:function(){
		touch.isSliding = true;
		touch.trackTrail = [];
	},

	normalizeEvent:function(e){
		if(!e)return {pageX:0, pageY:0};
		
		if(e.pageX === undefined || e.pageY === undefined){
			if(e.touches && e.touches.length){
				e = e.touches[0];
			}else if(e.changedTouches && e.changedTouches.length){
				e = e.changedTouches[0];
			}
		}
		
		var pageX = e.pageX;
		var pageY = e.pageY;
		
		if(pageX === undefined && e.clientX !== undefined){
			pageX = e.clientX + (window.pageXOffset || document.documentElement.scrollLeft || 0);
		}
		if(pageY === undefined && e.clientY !== undefined){
			pageY = e.clientY + (window.pageYOffset || document.documentElement.scrollTop || 0);
		}

		if(!isFinite(pageX)) pageX = 0;
		if(!isFinite(pageY)) pageY = 0;

		var viewport = window.mapViewport || { scale: 1, left: 0, top: 0 };
		var scale = viewport.scale || 1;
		var left = viewport.left || 0;
		var top = viewport.top || 0;
		var gameX = scale ? (pageX - left) / scale : pageX;
		var gameY = scale ? (pageY - top) / scale : pageY;
		
		return {
			pageX:pageX,
			pageY:pageY,
			gameX:gameX,
			gameY:gameY,
			target:e.target,
			currentTarget:e.currentTarget,
			type:e.type,
			preventDefault:function(){
				if(e.preventDefault) e.preventDefault();
			},
			stopPropagation:function(){
				if(e.stopPropagation) e.stopPropagation();
			}
		};
	},

	init:function(){
		//var trackTrail = [];
		var isDown = false;
		var hasMoved = true;
		var holdTimer;
		touch.isSliding = false;
		
		var normalize = function(e){
			return touch.normalizeEvent(e);
		}
		
		document.body.onmousedown = function(e){
			e = normalize(e);
			if(!touch.powerDisable){
			
				if(!touch.disabled){
					
					isDown = true;
					touch.isSliding = true;
					hasMoved = false;
					touch.trackTrail = [];
					
					var mouseEvent = e;
					
					touch.data.mouseUpCords = {pageX:e.pageX, pageY:e.pageY, gameX:e.gameX, gameY:e.gameY};
					touch.data.mouseDownCords = {pageX:e.pageX, pageY:e.pageY, gameX:e.gameX, gameY:e.gameY}
					
					//Run saved functions
					$(touch.data.downFuncs).each(function(i, func){
						func(mouseEvent);
					});
					
					holdTimer = setTimeout(function(){
						if(isDown && !hasMoved){
							if(!touch.disabled){
								$(touch.data.holdFuncs).each(function(i, func){
									func(mouseEvent);
								});
							}
						}
					}, 300)
					
					//Make sure nothing is selected
					return false;
					
				}else {
					if(!screen.hasInputs())
						return false;
				}
			
			}
		}
		
		document.body.onmouseup = function(e){
			e = normalize(e);
			
			if(!touch.powerDisable){
			
				if(!touch.disabled){
					
					if(hasMoved && touch.isSliding && touch.trackTrail.length != 0 && touch.slideOnUp){
						touch.activateTrackTrail(touch.trackTrail);
					}
					
					isDown = false;
					touch.isSliding = false;
					touch.data.mouseUpCords.hasMoved = hasMoved;
					clearTimeout(holdTimer);
					
					//Run saved functions
					$(touch.data.upFuncs).each(function(i, func){
						func(touch.data.mouseUpCords);
					});
					
					//Make sure nothing is selected
					return false;
					
				}else {
					if(!screen.hasInputs())
						return false;
				}
			}
		}
		
		document.body.onmousemove = function(e){
			e = normalize(e);
			
			if(!touch.powerDisable){
			
				if(!touch.disabled){
					
					hasMoved = true;
					touch.data.mouseUpCords = {pageX:e.pageX, pageY:e.pageY, gameX:e.gameX, gameY:e.gameY}
					
					if(isDown && touch.isSliding){
						
						if(touch.trackTrail.length < touch.trailLimit){
							touch.trackTrail.push([e.gameX, e.gameY]);
						
						}else{
							touch.activateTrackTrail(touch.trackTrail);
						}
					}
					
					//Run saved functions
					$(touch.data.moveFuncs).each(function(i, func){
						func(e);
					});
					
					//Make sure nothing is selected
					return false;
				
				}else {
					
					hasMoved = false;
					isDown = false;
					touch.isSliding = false;
					
					if(!screen.hasInputs())
						return false;
				}
			}
		}
		
		document.body.ontouchstart = function(e){
			return document.body.onmousedown(e);
		};
		document.body.ontouchmove = function(e){
			return document.body.onmousemove(e);
		};
		document.body.ontouchend = function(e){
			return document.body.onmouseup(e);
		};
		
		// Keep compatibility with older inline window handlers used by older Cordova/WebView contexts
		window.ontouchstart = document.body.ontouchstart;
		window.ontouchmove = document.body.ontouchmove;
		window.ontouchend = document.body.ontouchend;
		
	},
	
	bind:function(elm){
		
		if(elm.onclick && elm.onmouseup){
			elm.ontouchend = function(){
				elm.onmouseup();
				elm.onclick();
			}
		}else if (elm.onmouseup) {
			elm.ontouchend = elm.onmouseup;
		}else if (elm.onclick) {
			elm.ontouchend = elm.onclick;
		}
		
		if(elm.onmousemove)
			elm.ontouchmove = elm.onmousemove;
		
		if(elm.onmousedown)
			elm.ontouchstart = elm.onmousedown;
			
//		if(elm.onclick)
//			elm.ontouchstart = elm.onclick;
//		
//		if(elm.onmousemove)
//			elm.ontouchmove = elm.onmousemove;
//		
//		if(elm.onmouseup)
//			elm.ontouchend = elm.onmouseup;
	},
	
	clear:function(){
		
		this.data.downFuncs				= [];
		this.data.upFuncs				= [];
		this.data.moveFuncs				= [];
		this.data.holdFuncs				= [];
		this.data.slideDownFuncs		= [];
		this.data.slideUpFuncs			= [];
		this.data.slideLeftFuncs		= [];
		this.data.slideRightFuncs		= [];
		this.data.leftEdgeSlideFuncs	= [];
		
	},
	
	disable:function(){
		this.disabled = true;
	},
	
	enable:function(){
		this.disabled = false;
	},
	
	scrollable:function(elm){
		
		var startPos, endPos, letsScroll, startScroll;
		elm[0].setAttribute("disabled", "false")
		
		touch.down(function(e){
			
			if(elm[0].getAttribute("disabled") == "true") return false;
			
			var elmBottom 	= parseInt(elm.css("marginTop"));
			var elmTop		= parseInt(elm.css("marginTop")) + parseInt(elm.css("height")) + parseInt(elm.css("paddingTop")) + 80;
			
			startScroll 	= elm[0].scrollTop;
			startPos 		= e.pageY;
			
			if((e.pageY > elmBottom) && (e.pageY < elmTop)){
				letsScroll = true;
			}
		})
		
		
		touch.move(function(e){
			if(elm[0].getAttribute("disabled") == "true") return false;
			
			//log(elm.attr("disabled"))
			
			if(letsScroll == true){
				elm[0].scrollTop = startScroll + startPos - e.pageY
			}
		})
		
		
		touch.up(function(e){
			if(elm.attr("disabled") == "true") return false;
			
			letsScroll = false;
		})
		
		touch.bind(elm[0])
	},
	
	unScrollable:function(elm){
		
		elm[0].setAttribute("disabled", "true")
	}
	
}




















