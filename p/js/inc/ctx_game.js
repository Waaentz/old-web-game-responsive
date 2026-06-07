///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GAME CONTROLLER ////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


var game = {
	
	level:null,
	score:null,
	playedTime:null,
	builded:false,
	user:null,
	map:null,
	onClearFuncs:[],
	onMenuFunc:null,
	steps:0,
	isPlaying:false,
	canUndo:false,
	trail:[],
	highscoreId:null,
	jumpAudio:false,
	isMenuShowing:false,
	
	animationTime:{
		unit: 400,
		box:500
	},
	
	
	
	
	
	loadLevel:function(level){

		//Create shortcut and clear current map
		this.level = level;
		$("game *").remove();
		
		//Create map from level.map
		this.map = null;
		this.map = mapObject(level.map)
		
		//Add user unit if there is one
		this.user = this.map.user;
		
		//Append map to game
		$("game").append($(this.map.element));
		
		//Create menu items
		var menuElm 		= $("<btn>").html("menu").addClass("menu");
		var undoElm 		= $("<btn>").html("Undo").addClass("undo disabled");
		var stepsElm		= $("<btn>").html("0").addClass("steps");
		
		//Change menu if game is in edit mode
		if(game.editMode){
			menuElm.html("Editor").addClass("editor");
			undoElm.addClass("editor");
		}
		
		//Click function on menu element
		menuElm[0].onmouseup = function(){
			
			//Use menu func if provided
			if(game.editMode){
				game.onMenuFunc();
			
			//Else, use standard menu
			}else {
				game.showMenu();
			}
		}
		
		undoElm[0].onmouseup = function(){
			if(game.canUndo)
				game.undo();
		}
		
		touch.bind(menuElm[0]);
		touch.bind(undoElm[0]);
		
		//Append menu
		$(this.map.element).find("items").prepend(menuElm);
		$(this.map.element).find("items").prepend(undoElm);
		$(this.map.element).find("items").prepend(stepsElm);
	},
	
	showMenu:function(){

		game.isMenuShowing = true;
		
		screen.gameMenu({
			menuItems:[
				{
					text:"Resume",
					btnClass:"continue",
					action:function(){
						game.play();
						game.user.cleanUpZindexError();
						game.isMenuShowing = false;
					}
				},
				
				{
					text:"Restart",
					btnClass:"restart",
					action:function(){
						
						//Add level stat to local storage
						game.addStats()
						
						//Restart game
						screen.transition.fadeIn(function(){
							var curLevel = game.level;
							game.clear();
							game.start(curLevel);
							screen.transition.fadeOut();
						})
					}
				},
				
				{
					text:"Skip",
					btnClass:"skip",
					disabled:game.level.isLast,
					action:function(){
						
						//Add level stat to local storage
						game.addStats()
						
						//Skip level
						screen.transition.fadeIn(function(){

							//Store current level in DOM
							var curLevel = game.level;

							//Clear game and load next level
							game.clear();
							game.start(curLevel.nextLevel());

							//Fade out
							screen.transition.fadeOut();
						})
					}
				},
				
				{
					text:"Levels",
					btnClass:"select",
					action:function(){
						
						//Add level stat to local storage
						game.addStats()
						
						//stop game
						game.stop();

						screen.transition.fadeIn(function(){

							screen.pack({
								packId:game.level.pack.id,
								backAction:screenLevelPacks
							})

						})
					}
				},
				
				{
					text:"All Challenges",
					btnClass:"challenges",
					action:function(){
						screen.transition.fadeIn(function(){
							challengesOverview({
								backAction:function(){
									screenOverview()
								}
							});
						})
					}
				},

				{
					text:"Main menu",
					btnClass:"menu",
					action:function(){
					
						//Add level stat to local storage
						game.addStats()
						
						//Stop game and open main menu screen
						game.stop();
						screen.transition.fadeIn(function(){
							screenOverview()
						})
					}
				}
			]
		})
	},
	
	menuAction:function(func){
		this.onMenuFunc = func;
	},	
	
	start:function(level){
		console.log(level)
		game.clear();
		this.isPlaying = true;
		this.timeStarted = new Date();
		game.isMenuShowing = false;

		//Get all user hallenges on this level
		game.challengesArray = challenges.getByLevelId(level.id);
		
		if(game.mode == 'challenge'){
			$("game").addClass("challenge")
		}

		//Create localStorage.completed if it does not already exists
		if(!localStorage.completed)localStorage.completed = "";
		
		//Check if game platform has been builded.. If not, do it
		if(!this.builded){
			this.build();
		}
		
		//There is parsed a level along, load it
		if(level){
			this.loadLevel(level);
		}
		
		//Check if boxes is in goals
		$(game.map.boxes).each(function(i, box){
			if(game.map.isGoal(box.position)){
				game.map.setBox({
					box:box,
					position:box.position
				})
			}
		})
		




		//Play tutorial if this is first level in practice mode
		if(level.isFirst && level.pack.id == 1){

			var speakElm 	= $("<speak>");
			var miniPoonie 	= $("<minipoonie>");
			var handElm 	= $("<hand>")

			var jumps = 5;
			
			var jumpFn = function(){
				game.user.moveRight();
				jumps--;

				if(jumps>0){
					setTimeout(jumpFn, 400)
				}else{
					setTimeout(function(){

						//Enable touch when animation stops
						touch.disabled = false;

						//Append tutorial elements
						$("game").append(speakElm);
						speakElm.append(miniPoonie);
						speakElm.append(handElm);

						//Show menu
						$("game btn.menu").show();
						$("game btn.undo").show();

						touch.down(function(){
							speakElm.addClass("hide");
							setTimeout(function(){
								speakElm.remove();
							}, 300)
						})

					}, 500)
				}
			}

			//Start jumping and disabpe touch
			setTimeout(jumpFn, 500);
			touch.disabled = true;
			
			//Hide menu 
			$("game btn.menu").hide();
			$("game btn.undo").hide();
		}


		//Show level sign if level is not the very first where the tutorial is
		if(!(level.isFirst && level.pack.id == 1)){
			//alert(levels.getPackName(level.packId) + " #" + level.name)

			//disable touch
			touch.disabled = true;

			var onScreenElm = $("<onscreen>").addClass("pack" + level.packId);
			var titleElm = $("<leveltitle>");

			titleElm.html(level.name);

			onScreenElm.append(titleElm);
			$("game").append(onScreenElm);
			applyOnscreenViewport();
			setTimeout(function(){
				onScreenElm.remove();
				game.user.cleanUpZindexError();
				touch.disabled = false;
			}, 2010)
		}

		//Define slide functions
		touch.slideDown(function(){
			if(game.isPlaying && !game.isMenuShowing){
				game.user.moveDown();
			}
				
		})
		
		touch.slideUp(function(){
			if(game.isPlaying && !game.isMenuShowing){
				game.user.moveUp();
			}
				
		})
		
		touch.slideLeft(function(){
			if(game.isPlaying && !game.isMenuShowing){
				game.user.moveLeft();
			}
				
		})
		
		touch.slideRight(function(){
			if(game.isPlaying && !game.isMenuShowing){
				game.user.moveRight();
			}
				
		})

		screen.transition.fadeOut();
		game.user.cleanUpZindexError();
	},
	
	restoreFromTrailObject:function(trailObj){
		
		$(trailObj.boxesArray).each(function(i, box){
			//box.obj.position = box.position;
			game.map.setBox({
				box:box.obj,
				position:box.position
			})
		})
		
		$(trailObj.unitArray).each(function(i, unit){
			//box.obj.position = box.position;
			game.map.setUnit({
				unit:unit.obj,
				position:unit.position
			})
		})
	},
	
	addTrail:function(){
		
		game.canUndo = false;
		
		setTimeout(function(){
			game.disableUndo(false);
		}, game.animationTime.unit)
		
		
		var unitArray = [];
		var boxesArray = []
		
		$(game.map.boxes).each(function(i, box){
			boxesArray.push({
				obj:box,
				position:box.position
			})
		})
		
		$(game.map.units).each(function(i, unit){
			unitArray.push({
				obj:unit,
				position:unit.position
			})
		})
		
		var dateTime = new Date();
		
		game.trail.push(
		{	
			dateTime:dateTime,
			unitArray:unitArray,
			boxesArray:boxesArray
		})
	},
	
	onClear:function(func){

		if(typeof func == "function")
			this.onClearFuncs = [func];
	},
	
	levelIsClear:function(levelId){
		return highscores.getHighestByLevelId(levelId).steps;
	},
	
	addStats:function(){
		
		var endTime = new Date();
		var totalTime = parseInt((endTime - game.timeStarted) / 1000);
		
		
		levelStats.add({
			levelId:	game.level.id,
			steps:		game.steps,
			timeUsed:	totalTime,
			datePlayed:	d().full
		})
	},
	
	addHighscore:function(){
		
		var endTime = new Date();
		var totalTime = parseInt((endTime - game.timeStarted) / 1000);

		highscores.add({
			levelId:		game.level.id,
			timespend:		totalTime,
			steps:			game.steps,
			mapTrack: 		game.trail,
			challengeId: 	(game.mode == 'challenge') ? game.challengeId : null
		})

		//Update packs
		packs.update()
	},
	
	clearLevel:function(levelID, steps){
		
		var curSteps = game.levelIsClear(levelID);
		
		//Add level stat to local storage
		game.addStats()
		game.addHighscore();
	},
	
	runOnClearFuncs:function(){
		
		if(game.mode == 'challenge'){
			game.challengeId;

			var ch = challenges.getById(game.challengeId);
			var him, you, scoreMode;

			var from = {
				id:ch.fromId,
				name:ch.fromName,
				score:ch.fromScore,
			}

			var to = {
				id:ch.toId,
				name:ch.toName,
				score:ch.toScore,
			}

			log([to,from, face.userId])

			if(to.id == face.userId){
				you = to;
				him = from;
			}else{
				you = from;
				him = to;
			}

			you.score = game.steps + 1;

			if(you.score < him.score){
				scoreMode = "winner"
			}else if(you.score > him.score){
				scoreMode = "looser"
			}else {
				scoreMode = "draw"
			}


			setTimeout(function(){

				screen.transition.fadeIn(function(){
					
					screen.challengeDone({
			            mode:scoreMode,
			            toName:to.name,
			            toScore:to.score,
			            fromName:from.name,
			            fromScore: from.score,
			            levelName: ch.levelPackName + ' ' +  ch.levelName,
			            
			            againAction:function(){
			            	screen.transition.fadeIn(function(){
								playGame({
									id:game.level.id,
									name:game.level.name,
									map:game.level.map,
									mode:'challenge',
									challengeId:game.challengeId
								})
							})
			            },
			        });
				})

				game.addHighscore();

			}, 500)

			return false;

		}


		//Return to editor if on testmode
		if(game.testMode){
			
			screen.transition.fadeIn(function(){
				screen.editor({
					level:game.level,
					new:game.isNew,
					isTesting:true,
					backAction:screenEditorOverview
				})
			})
			
			return false;
		}
		
		//Stop game and make touch disabled
		touch.disabled = true;
		
		//Fade game out and load clear screen after 500 milliseconds
		setTimeout(function(){
			
			screen.transition.fadeIn(function(){
				
				//Load LevelClear screen and save highscore
				var screenLevelClear = function(){
					
					//Get current score
					var oldScore = game.level.bestScore ? game.level.bestScore.steps : false;
					var newScore = game.steps;
					var isMaster = localStorage.isMaster;

					//Run screen
					screen.levelClear({
						nextAction:function(){
							
							//Clear screen and enable touch again
							screen.clear();
							touch.disabled = false;

							$(game.onClearFuncs).each(function(i, func){
								func({
									oldScore:oldScore,
									newScore:newScore,
									isMaster:isMaster
								});
							})
								
						},
						
						challengeAction:function(){
							screen.challenge({
								sentAction:function(){
									screenLevelClear();
								},
								backAction:function(){
									screenLevelClear();
								}
							});
						},
						
						levelsAction:function(){
							screen.pack({
			                    packId:game.level.pack.id,
			                    backAction:screenLevelPacks
			                })
						}
					})
				}
				
				screenLevelClear();
				game.clearLevel(game.level.id, game.steps);
			})
			
		}, 500);
	},
	
	stop:function(){
		this.isPlaying = false;
	},
	
	addStep:function(){
		this.steps++;
		$("btn.steps").html(this.steps);
	},
	
	pause:function(){
		touch.disabled = true;
	},
	
	play:function(){
		touch.disabled = false;
	},
	
	undo:function(){
		game.steps -= 2;
		game.restoreFromTrailObject(game.trail[game.trail.length-1]);
		
		game.disableUndo(true);
	},
	
	disableUndo:function(disableStatus){
		this.canUndo = !disableStatus;
		
		if(disableStatus){
			$("btn.undo").addClass("disabled");
		}else {
			$("btn.undo").removeClass("disabled");
		}
	},
	
	build:function(){
		
		//Define game area
		var game = $("game").exists() ? $("game") : $("<game>");
		$("body").append(game);
		this.builded = true;
	},
	
	clear:function(){
		touch.clear();
		this.steps = 0;
		this.builded = false;
		this.level = null;
		this.user = null;
		this.trail = [];
		this.highscoreId = null;
		
		//this.editMode = false;
		$("game").remove();
	},


	// new functions

	loadLevel:function(level){
		//console.log(level)
	},

	start:function(level){
		
		//Create level shortcut
		game.level = level;

		//Create map Object
		game.map = new map(level.map);

		//Set slide functions
		touch.slideDown(function(){
			game.map.user.move("down");
		})

		touch.slideUp(function(){
			game.map.user.move("up");
		})

		touch.slideRight(function(){
			game.map.user.move("right");
		})

		touch.slideLeft(function(){
			game.map.user.move("left");
		})

		//Remove game tag if there
		$("game").remove();
		var gameElm = $("<game>");

		//Append map elm to game elm
		$(gameElm).append($(game.map.elm));

		//Append game and map to html
		$("body").append(gameElm);
	}

}


var map = function(data){

	data.size.w = data.size[0];
	data.size.h = data.size[1];
	data.fieldSize = mobile.screen.width / data.size.w;
	var that = this;

	//Create html elements
	var mapElm = $("<map>");
	var canvasElm = $('<canvas>').attr('width', mobile.screen.width).attr('height', mobile.screen.height);
	var ctx = canvasElm[0].getContext('2d');
	mapElm.append(canvasElm);

	//Create map matrix
	var matrix = [];
	for(var i = 0; i<data.size.h; i++){	//Add rows
		var rowArray = [];
		for(var j = 0; j<data.size.w; j++){	//add Colums
			rowArray.push([]);
		}
		matrix.push(rowArray);
	}

	//Make it easy to fetch matrix fields
	matrix.get = function(data){
		return matrix[data.y][data.x];
	};

	matrix.moveItem = function(item, nextPos){
		var currentField = matrix.get(item.pos);
		var nextField = matrix.get(nextPos);

		//Remove item from current field
		$(currentField).each(function(i, loopItem){
			if(loopItem.type == item.type){
				currentField.splice(i, 1);
			}
		})

		//Add item to next field
		nextField.push(item);

		//Update item's pos to new position
		item.pos = nextPos;
	},

	//Draw everything in matrix onto canvas
	matrix.draw = function(){
		//Clear canvas
		canvasElm[0].width = canvasElm[0].width;

		//Draw all field items first
		$(data.fieldItems).each(function(i, item){
			item.draw();
		})

		//Draw all images onto map
		$(matrix).each(function(i, row){

			//Holder for user item for drawing as last item in row
			var userHolder = false;

			$(row).each(function(i, field){
				$(field).each(function(i, item){
					
					//If item is user, save for last item in row so the user item can be on top in his row
					if(item.type == "user"){
						userHolder = item;
					}else{
						item.draw();
					}
				})
			})

			//Draw user if it is in userHolder
			if(userHolder){
				userHolder.draw();
				userHolder = false;
			}
		})
	}

	//Merge all map items into one large array
	//var items = $.merge(data.fieldItems, data.items);
	var	items = $.merge(data.items, data.boxes);
		items = $.merge(items, data.units);

	//Fill matrix with fieldItems
	$(data.fieldItems).each(function(i, item){
		
		//Add kind
		item.kind = item.type.split("-")[0];

		//Fix pos values
		item.pos = {x:item.position[0], y:item.position[1]}

		var field = matrix.get(item.pos);
		if(field){

			//Draw function
			item.draw = function(){drawItemFunction(item)};
		}
	})

	//Fill matrix with map items
	$(items).each(function(i, item){
		
		//Add kind
		item.kind = item.type.split("-")[0];

		//Fix pos values
		item.pos = {x:item.position[0], y:item.position[1]}

		var field = matrix.get(item.pos);
		if(field){
			field.push(item);

			//Draw function
			item.draw = function(){drawItemFunction(item)};

			if(item.type == "user"){
				that.user = item;
				
				//Make user item animatable
				userAnimate(item);
			}

			if(item.kind == "poo"){
				//Make poo item animatable
				pooAnimate(item);
			}
		}
	})

	function pooAnimate(item){
		item.animate = function(direction, endFunc){

			item.currentFrame = 0;
			item.offset = {x:0, y:0};

			var frames = 64;
			var frameRate = game.map.user.animationTime / frames
			var interval;

			var animationFunction = function(){

				item.currentFrame++;

				//Change poo position
				switch(direction){
					case "down": 	item.offset.y = item.currentFrame;	break;
					case "up": 		item.offset.y = -item.currentFrame;	break;
					case "right": 	item.offset.x = item.currentFrame;	break;
					case "left": 	item.offset.x = -item.currentFrame;	break;
				};

				//if poo is at its end place, run endFunction
				if(item.currentFrame >= frames){
					clearInterval(interval);
					endFunc();
				}
			}

			interval = setInterval(animationFunction, frameRate)

		}
	}

	function userAnimate(item){

		item.move = function(direction){

			//if item is already animating, wait untill it finish and run next move
			if(item.inAnimation){
				item.nextMove = direction;
				return false;
			}

			//Get next position
			var nextPos = {x:item.pos.x,y:item.pos.y};

			switch(direction){
				case "down": 	nextPos.y++;	break;
				case "up": 		nextPos.y--;	break;
				case "right": 	nextPos.x++;	break;
				case "left": 	nextPos.x--;	break;
			}

			//Check if any items is at next position
			if(matrix.get(nextPos).length > 0){
				
				//Abort if next move already is saved
				if(item.nextMove)return false;

				//Create poo item if its in field
				var pooItem = false;
				$(matrix.get(nextPos)).each(function(i, item){
					if(item.kind == "poo"){
						pooItem = item;
					}
				})

				//If next position has a poo, move it if possible
				if(pooItem){
					
					//Get next to poo position
					var nextNextPos = {x:nextPos.x,y:nextPos.y};

					switch(direction){
						case "down": 	nextNextPos.y++;	break;
						case "up": 		nextNextPos.y--;	break;
						case "right": 	nextNextPos.x++;	break;
						case "left": 	nextNextPos.x--;	break;
					};

					var nextNextField = matrix.get(nextNextPos);
					var canPushHere = true;

					$(nextNextField).each(function(i, item){
						if(item.kind != "goal"){
							canPushHere = false;
						}
					})

					//If field is not blocked, push poo here
					if(canPushHere){
						item.animate("push" + direction, 
							function(){
								matrix.moveItem(item, nextPos);
								item.state = direction;
							}
						);

						pooItem.animate(direction, 
							function(){
								matrix.moveItem(pooItem, nextNextPos);
							}
						);
					}
				}

			}else{
				//Animate item for jump in selected direction
				item.animate("jump" + direction, 
					function(){
						matrix.moveItem(item, nextPos);
					}
				);
			}
		};

		item.animate = function(animationType, endFunc){

			//Only allow animation when its not already animating
			if(item.inAnimation){
				return false;
			}

			//If device is old, use item.move function instead
			if(device.isOld){
				item.simpleAnimate(animationType, endFunc);
				return false;
			}

			//Set state of item 
			item.state = animationType;
			item.inAnimation = true;
			item.currentFrame = 0;
			item.animationTime = 400;

			//Get current animation framerate
			var frameRate = item.animationTime / item.states[item.state].frames;

			//change frame function
			function changeFrame(){
				
				//Count frame up
				item.currentFrame++

				//Clear interval timer if animation have no more frames
				if(item.currentFrame >= item.states[item.state].frames){
					clearInterval(item.interval);

					//Reset item animation properties
					item.inAnimation = false;
					item.currentFrame = 0;

					//Run end function
					endFunc();

					//Run next move if added
					if(item.nextMove){
						var nextDirection = item.nextMove;
						item.nextMove = false;
						item.move(nextDirection);
					}
				}

				//Redraw matrix
				matrix.draw();
			};

			//Start animation interval
			item.interval = setInterval(changeFrame, frameRate);
		};

		item.simpleAnimate = function(animationType, endFunc){
			endFunc();
			//Redraw matrix
			matrix.draw();
		}
	}

	function drawItemFunction(item){
		
		if(item.type == "user"){
			drawUserFunction(item);
			return false;
		}

		var x = item.pos.x * data.fieldSize,
			y = item.pos.y * data.fieldSize,
			w = data.fieldSize,
			h = data.fieldSize;

		//Get item from itemTypes
		var itemImage = itemImages.get(item.type);

		//Draw image on map if it is there
		if(itemImage){
			if(!item.offset)item.offset={x:0,y:0}//create offset for item without
			ctx.drawImage(itemImage.image, x + itemImage.x + item.offset.x, y + itemImage.y + item.offset.y);
		}
	}

	function drawUserFunction(item){
		var x = item.pos.x * data.fieldSize,
			y = item.pos.y * data.fieldSize,
			w = data.fieldSize,
			h = data.fieldSize;

		//Create user image if it does not exist
		if(!item.states){

			item.state = "down";
			item.currentFrame = 0;

			item.states = {
				down:{
					x:-28,y:-36,
					w:130,h:130,
					offset:{x:0,y:0},
				},
				up:{
					x:-28,y:-36,
					w:130,h:130,
					offset:{x:0,y:0}
				},
				right:{
					x:-7,y:-36,
					w:80,h:100,
					offset:{x:21,y:0}
				},
				left:{
					x:-6,y:-36,
					w:80,h:100,
					offset:{x:22,y:0}
				},

				jumpdown:{
					x:-28,y:-36,
					w:130,h:170,
					offset:{x:0,y:0},
					frames:20
				},

				jumpup:{
					x:-28,y:-96,
					w:130,h:170,
					offset:{x:0,y:0},
					frames:20
				},

				jumpright:{
					x:-7,y:-36,
					w:144,h:100,
					offset:{x:0,y:0},
					frames:20
				},

				jumpleft:{
					x:-68,y:-36,
					w:144,h:100,
					offset:{x:0,y:0},
					frames:20
				},

				pushdown:{
					x:-28,y:-36,
					w:130,h:170,
					offset:{x:0,y:0},
					frames:14
				},

				pushup:{
					x:-28,y:-96,
					w:130,h:170,
					offset:{x:0,y:0},
					frames:14
				},

				pushright:{
					x:-7,y:-36,
					w:144,h:100,
					offset:{x:0,y:0},
					frames:22
				},

				pushleft:{
					x:-68,y:-36,
					w:144,h:100,
					offset:{x:0,y:0},
					frames:22
				},
			};

			$(Object.keys(item.states)).each(function(i, state){
				var currentState = item.states[state];
				var image = new Image();
					image.src = itemImages.path + "animation/" + state + ".png"

				//Attach image to current state
				currentState.image = image;
			})
		}

		//Draw userimage to canvas
		ctx.drawImage(
			
			//item.mage,
			item.states[item.state].image,

			item.states[item.state].offset.x, 
			(item.inAnimation) ? (item.states[item.state].h * item.currentFrame) : item.states[item.state].offset.y,

			item.states[item.state].w, 
			item.states[item.state].h,

			x +	item.states[item.state].x, 
			y +	item.states[item.state].y,

			item.states[item.state].w, 
			item.states[item.state].h
		);
	}

	//Draw matrix 
	/*setInterval(function(){
		matrix.draw();
	},30)*/
	matrix.draw();
	
	//Make obj shortcuts
	this.elm = mapElm;
}








var itemImages = {
	path:"graphic/map-items/",

	get:function(type){
		var selectedItem = false;

		$(itemImages.data).each(function(i, item){
			if(item.type == type){
				
				//Select current item for return
				selectedItem = item;

				//Attach image to item if not alreay attached
				if(!item.image){
					
					//Get image url and attach image to item
					var imageUrl = itemImages.path + item.type + ".png";
					item.image = new Image();
					item.image.src = imageUrl;
				}
				return false;
			}
		})

		return selectedItem;
	},
	data:[
		{
			type:"stone-1",
			x:-10,
			y:-26
		},
		{
			type:"stone-2",
			x:-2,
			y:1
		},
		{
			type:"stone-3",
			x:-5,
			y:-23
		},
		{
			type:"stone-4",
			x:-8,
			y:-2
		},
		{
			type:"stone-5",
			x:1,
			y:0
		},
		{
			type:"stone-6",
			x:4,
			y:9
		},
		{
			type:"stone-7",
			x:-3,
			y:1
		},
		{
			type:"stone-8",
			x:1,
			y:-4
		},
		{
			type:"stone-9",
			x:7,
			y:-27
		},
		{
			type:"stone-10",
			x:4,
			y:-17
		},
		{
			type:"stone-11",
			x:-3,
			y:-7
		},
		{
			type:"stone-12",
			x:4,
			y:6
		},
		{
			type:"stone-13",
			x:-4,
			y:-18
		},
		{
			type:"stone-14",
			x:3,
			y:-5
		},
		{
			type:"stone-15",
			x:5,
			y:1
		},
		{
			type:"tree-1",
			x:5,
			y:-62
		},
		{
			type:"tree-2",
			x:5,
			y:-62
		},
		{
			type:"tree-3",
			x:5,
			y:-62
		},
		{
			type:"tree-4",
			x:13,
			y:-69
		},
		{
			type:"tree-5",
			x:13,
			y:-38
		},
		{
			type:"tree-6",
			x:13,
			y:-19
		},
		{
			type:"tree-7",
			x:13,
			y:-5
		},
		{
			type:"tree-8",
			x:2,
			y:-70
		},
		{
			type:"tree-9",
			x:2,
			y:-69
		},
		{
			type:"tree-10",
			x:3,
			y:-63
		},
		{
			type:"tree-chunks-1",
			x:3,
			y:3
		},
		{
			type:"tree-chunks-2",
			x:3,
			y:3
		},
		{
			type:"tree-chunks-3",
			x:3,
			y:3
		},
		{
			type:"tree-chunks-4",
			x:3,
			y:3
		},
		{
			type:"mushroom-1",
			x:3,
			y:3
		},
		{
			type:"mushroom-2",
			x:3,
			y:3
		},
		{
			type:"mushroom-3",
			x:3,
			y:3
		},
		{
			type:"mushroom-4",
			x:3,
			y:3
		},
		{
			type:"mushroom-5",
			x:3,
			y:3
		},
		{
			type:"poo-1",
			x:1,
			y:3
		},
		{
			type:"goal-1",
			x:-6,
			y:-1
		},

	]
}



































































































































