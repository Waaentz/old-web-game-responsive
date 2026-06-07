///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UNITS //////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function unitObject(data){
	
	var type 			= data.type ? data.type : "user-1";
	var position 		= data.position ? data.position : [0,0];
	var trail 			= [];
	var direction 		= data.direction ? data.direction : "right";
	var inTransition 	= false;
	var haveBox 		= data.haveBox ? data.haveBox : false;
	var stuck 			= false;
	var isUser 			= data.isUser ? data.isUser : false;
	var map				= data.map ? data.map : false;
	var objType 		= data.objType ? data.objType : "unit";
	
	var r = {
		type:			type,			//Later we might add other types of men
		position:		position,		//current position of man in map [left,top]
		trail:			trail,			//trail of all positions
		direction:		direction,		//current direction man is facing
		haveBox:		haveBox,		//If he is moving a box or not
		stuck:			stuck,			//if he is stuck but the user still tries to move him into wallitem (in animation mode)
		isUser:			isUser,			//if true, then this user will be connected to the Game object
		inTransition:	inTransition,	//Every time unit moves and therefor is not able to perform new actions, inTransition will be true
		map:			map,
		objType:		objType,
		nextMove:		null,
		//jumpSound: 		audioFileInGame("Jump-Effect"),
		//jumpSound2: 	audioFileInGame("Jump-Effect"),
		
		moveUp:function(){
			this.moveTo("up");
			
		},
		moveDown:function(){
			this.moveTo("down");
		},
		
		moveRight:function(){
			this.moveTo("right");
			
		},
		
		moveLeft:function(){
			this.moveTo("left");		
		},
		
		cleanUpZindexError:function(){

			this.animate({
				type:"animatenogo"
			})
		},
		
		
		moveTo:function(direction){
			
			if(this.element.hasClass("inTransition")){
				this.nextMove = direction;
				return false;
			}
			
			var x = this.position[0];
			var y = this.position[1];
			
			if(direction == "up"){
				y--;
			}else if (direction == "down") {
				y++;
			}else if (direction == "left") {
				x--;
			}else if (direction == "right") {
				x++;
			}
			
			
			
			
			
			//Add classname to current unit
			this.element.removeClass("right left up down");
			
			var nextPos = game.map.getField([x,y]);
			var animationType = "animateJump" + direction;
			
			if(nextPos.clearBox){
				nextPos = nextPos.clearBox;
			}
			
			
			//check if unit can move to next position or if it is blocked
			if(!nextPos || nextPos.walkOver){
				
				this.element.addClass(direction).addClass("inTransition");
				
				//Add trail
				game.addTrail();
				
				//Animate unit and set it afterwards
				this.animate({
					
					type:animationType,
					doneFunc:function(){
						
						//Set unit
						game.map.setUnit({
							unit:game.user,
							position:[x,y]
						});
						
					}
				})
				
			}else{
				
				if(nextPos.objType == "box"){
					
					var box = nextPos;
					var boxX = box.position[0];
					var boxY = box.position[1];
					
					if(direction == "up"){
						boxY--;
					}else if (direction == "down") {
						boxY++;
					}else if (direction == "left") {
						boxX--;
					}else if (direction == "right") {
						boxX++;
					}
					
					var nextToBox = game.map.getField([boxX,boxY]);
					
					if(nextToBox.clearBox){
						nextToBox = nextToBox.clearBox;
					}
					
					
					if(!nextToBox || nextToBox.walkOver){
						
						this.element.addClass(direction).addClass("inTransition");
						animationType = "animatePush" + direction;
						
						//Add trail
						game.addTrail();
						
						this.animate({
							
							type:animationType,
							beforeFunc:function(){
								//move box
								game.map.setBox({
									box:box,
									position:[boxX,boxY]
								})

								//game.user.jumpSound.play()

							},
							doneFunc:function(){
								
								//move unit
								game.map.setUnit({
									unit:game.user,
									position:[x,y]
								})
								
							}
						})
						
						
					}else{
						this.element.addClass("inTransition");
						
						//Animate unit and set it afterwards
						this.animate({
							type:"animatenogo"
						})
					}
					
				}else{
					
					this.element.addClass("inTransition");
					
					//Animate unit and set it afterwards
					this.animate({
						type:"animatenogo"
					})
				}
			}
			
			
			
			
			
		},
		
		animate:function(data){
			
			//Clear animation first
			clearInterval(this.animation);
			
			//Set inTransition at true
			game.user.inTransition = true;
			
			
			var unitElm = this.element.find("inner")[0];
			var frame = 0;
			var frameFunction;
			var activateFrameFunction;
			var frames = 20;
			var animationTime = game.animationTime.unit;
			var that = this;
			
			
			var animationDown = function(){
				unitElm.style.backgroundPosition = "-130px " + (frame++ * -170) + "px";
			}
			
			var animationUp = function(){
				unitElm.style.backgroundPosition = "-260px " + (frame++ * -170) + "px";
			}
			
			var animationRight = function(){
				unitElm.style.backgroundPosition = "-390px " + (frame++ * -100) + "px";
			}
			
			var animationLeft = function(){
				unitElm.style.backgroundPosition = "-535px " + (frame++ * -100) + "px";
			}
			
			var animationNoGo = function(){
				unitElm.style.backgroundPosition = "-677px " + (frame++ * -170) + "px";
			}
			
			var animationPushRight = function(){
				unitElm.style.backgroundPosition = "-807px " + (frame++ * -100) + "px";
			}
			
			var animationPushLeft = function(){
				unitElm.style.backgroundPosition = "-952px " + (frame++ * -100) + "px";
			}
			
			var animationPushDown = function(){
				unitElm.style.backgroundPosition = "-1096px " + (frame++ * -170) + "px";
			}
			
			var animationPushUp = function(){
				unitElm.style.backgroundPosition = "-1226px " + (frame++ * -170) + "px";
			}
			
			
			
			if(data.type == "animateJumpdown"){
				frameFunction = animationDown;
				
			}else if (data.type == "animateJumpup") {
				frameFunction = animationUp;
				
			}else if (data.type == "animateJumpright") {
				frameFunction = animationRight;
				
			}else if (data.type == "animateJumpleft") {
				frameFunction = animationLeft;
			
			}else if (data.type == "animatenogo") {
				frameFunction = animationNoGo;
				frames = 6;
				animationTime = 200;
				
			}else if (data.type == "animatePushright") {
				frameFunction = animationPushRight;
				frames = 22;
				
			}else if (data.type == "animatePushleft") {
				frameFunction = animationPushLeft;
				frames = 22;
				
			}else if (data.type == "animatePushdown") {
				frameFunction = animationPushDown;
				frames = 14;
			}else if (data.type == "animatePushup") {
				frameFunction = animationPushUp;
				frames = 14;
			}
			
			
			if(typeof data.beforeFunc == "function"){
				setTimeout(function(){
					
					data.beforeFunc();
				
				}, 200)
				
			}
			
			//Run first frame now
			frameFunction()
			
			//Set interval for frames
			/*this.animation = setInterval(
				function(){
					console.log(0)
					frameFunction();
				}, 
			animationTime / frames)*/
			
			//Clear animation
			setTimeout(function(){
				
				clearInterval(game.user.animation);
				unitElm.style.backgroundPosition = "";
				game.user.inTransition = false;
				
				//Clear user from old classes
				game.user.element.removeClass("inTransition animateJumpdown animateJumpup animateJumpright animateJumpleft animatenogo");
				
				if(typeof data.doneFunc == "function"){
					data.doneFunc();
				}
				
				
				
				//Play next move if its there
				if(game.user.nextMove != null){
					
					var nextMove = game.user.nextMove;
					
					game.user.nextMove = null;
					game.user.moveTo(nextMove);
					
				}
				
			}, animationTime)
			
			
		},
		
		remove:function(){
			this.map.removeUnit(this);
		}
	}
	
	return r;
}




















