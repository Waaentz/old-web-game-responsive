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
		applyMapViewport();
		
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

		//Get all user challenges on this level
		game.challengesArray = challenges.get(level.id);
		
		if(game.mode == 'challenge'){
			$("game").addClass("challenge")
		}

		//Create localStorage.completed if it does not already exists
		//if(!localStorage.completed)localStorage.completed = "";
		
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
	
	
	//levelIsClear:function(levelId){
	//	return highscores.getHighestByLevelId(levelId).steps;
	//},
	
	
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
		
/*		if(game.mode == 'challenge'){
			game.challengeId
		}
*/
		highscores.add({
			levelId:		game.level.id,
			timespend:		totalTime,
			steps:			game.steps,
			mapTrack: 		game.trail,
			challengeId: 	game.isChallenge ? game.isChallenge.id : null
		})

		//Update packs
		packs.update()
		
		
	},
	
	
	clearLevel:function(levelID, steps){

        //Add level stat to local storage
		game.addStats()
		game.addHighscore();
		
        game.isChallenge = false;
		
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
				
                if(game.isChallenge){
                    game.onClearFuncs[0]();
                }else{
                    screenLevelClear();
                }
				
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
	}
}


















