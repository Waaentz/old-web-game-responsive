///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITEM ///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var screen = {
	



	/*
	#### ##    ## ######## ########   #######  
	 ##  ###   ##    ##    ##     ## ##     ## 
	 ##  ####  ##    ##    ##     ## ##     ## 
	 ##  ## ## ##    ##    ########  ##     ## 
	 ##  ##  ####    ##    ##   ##   ##     ## 
	 ##  ##   ###    ##    ##    ##  ##     ## 
	#### ##    ##    ##    ##     ##  #######  */


	intro:function(){
		
        var introElm = $("<intro>");
        var loadingImage = new Image();
        loadingImage.src = "graphic/screens/loading/background.png";
        
        //Append loading screen to body
        $("body").append(introElm);
        if(typeof applyIntroViewport == "function"){
            applyIntroViewport();
        }
        
        //When loading screen has loaded 100%, load overview
        loadingImage.onload = function(){
            screenOverview();
            
            //Remove loading screen after a few seconds
            setTimeout(function(){
                introElm.addClass("remove");
                setTimeout(function(){
                    introElm.remove();
                }, 500)
            }, 1000)
        }
        
        
        
        
		/*//Create screen elements
		var screenElm 			= screen.new("intro");
		var loadingElm 			= $("<loading>");
		var pooElm 				= $("<poo>");
		var poonieElm 			= $("<poonie>");
		var poonieShadowElm 	= $("<shadow>");
		
		//Create buttons
		var playBtn 	= screen.elm.btn("Play", "play");
		
		//Append elements
		screenElm.append(loadingElm);
		screenElm.append(pooElm);
		screenElm.append(poonieElm);
		screenElm.append(poonieShadowElm);
		
		//Append menu
		screenElm.append(playBtn);
		
		//Make time for animation
		setTimeout(function(){data.action()}, 2600)
		
		//Append all to body
		$("body").append(screenElm);*/
	},
	
	
	
	
	/*
	 #######  ##     ## ######## ########  ##     ## #### ######## ##      ## 
	##     ## ##     ## ##       ##     ## ##     ##  ##  ##       ##  ##  ## 
	##     ## ##     ## ##       ##     ## ##     ##  ##  ##       ##  ##  ## 
	##     ## ##     ## ######   ########  ##     ##  ##  ######   ##  ##  ## 
	##     ##  ##   ##  ##       ##   ##    ##   ##   ##  ##       ##  ##  ## 
	##     ##   ## ##   ##       ##    ##    ## ##    ##  ##       ##  ##  ## 
	 #######     ###    ######## ##     ##    ###    #### ########  ###  ###  */



 	overview:function(data){
		var screenElm 			= screen.new("overview");
		var poonieElm 			= $("<poonie>");
		var poonieShadowElm 	= $("<shadow>");
		var audioElm 			= $("<audiobtn>");
		var logElm				= $("<logging>");
		var fbLogoutBtn			= $("<fblogout>");
		var topWaterElm 		= $("<topwater>");
		var bottomWaterElm 		= $("<bottomwater>");
		var groundBaseElm		= $("<groundbase>");
		var shinesElm			= $("<shines>");
		var woodElm				= $("<wood>");
		var waveElm				= $("<wave>");
		var grass2Elm			= $("<grasstwo>");
		var grass3Elm			= $("<grasstree>");
		
		//Create buttons
		var playBtn 	= screen.elm.btn("Play", "play");
		
		
		//Append elements
		screenElm.append(audioElm);
		screenElm.append(poonieElm);
		screenElm.append(poonieShadowElm);
		screenElm.append(fbLogoutBtn);
		screenElm.append(topWaterElm);
		screenElm.append(bottomWaterElm);
		screenElm.append(groundBaseElm);
		screenElm.append(shinesElm);
		screenElm.append(woodElm);
		screenElm.append(waveElm);
		screenElm.append(grass2Elm);
		screenElm.append(grass3Elm);
		
		//Append menu
		screenElm.append(playBtn);

		//Play the menu music
		menuMusic.play();

		//Make poonie clickable
		poonieElm[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.playAction();
			})
		}

		//Make it blink baby
		var blink = function(){
			poonieElm.removeClass("left down up right");
			poonieElm.addClass("blink");
			setTimeout(function(){
				poonieElm.removeClass("blink");
				setTimeout(blink, Math.floor((Math.random()*5000)+1))
			}, (Math.floor((Math.random()*150)+150)))
		}


		var lookAround = function(){

			var dir = Math.floor((Math.random()*4)+1);

			if(dir == 1){
				poonieElm.addClass("right");
			}else if(dir == 2){
				poonieElm.addClass("left");
			}else if(dir == 3){
				poonieElm.addClass("up");
			}else if(dir == 4){
				poonieElm.addClass("down");
			}

			setTimeout(function(){
				
				poonieElm.removeClass("blink left down up right");
				setTimeout(lookAround, Math.floor((Math.random()*15000)+1000))

			}, (Math.floor((Math.random()*1050)+450)))
		}

		setTimeout(blink, 2000)
		setTimeout(lookAround, 4000)

		//Set action for music btn
		audioElm[0].onclick = function(){
			if(localStorage.music == undefined || localStorage.music == "true"){
				localStorage.music = "false";
				menuMusic.pause();
				audioElm.addClass("off");
				
			}else {
				localStorage.music = "true";
				menuMusic.play();
				audioElm.removeClass("off");
			}
		}
		
		if(localStorage.music == "false"){
			audioElm.addClass("off");
		}
		
		//Set actions for buttons
		playBtn[0].onmouseup = function(){
			screen.transition.fadeIn(function(){
				data.playAction();
			})
		}

		playBtn[0].onmousedown = function(){
			poonieElm.addClass("down");
		}

		fbLogoutBtn[0].onclick = function(){
			face.logout()
				
		}
		
		//Bind buttons
		touch.bind(playBtn[0]);
		touch.bind(audioElm[0]);
		touch.bind(fbLogoutBtn[0]);
		touch.bind(poonieElm[0]);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade out if fade has begun
		screen.transition.fadeOut();
        		//activateChallengeCount();

		//Delete preloaded images
		setTimeout(function(){
			$("imgholder").remove();
		}, 3000)


	},




/*
	 ######  ########  ######## ########  #### ########  ######  
	##    ## ##     ## ##       ##     ##  ##     ##    ##    ## 
	##       ##     ## ##       ##     ##  ##     ##    ##       
	##       ########  ######   ##     ##  ##     ##     ######  
	##       ##   ##   ##       ##     ##  ##     ##          ## 
	##    ## ##    ##  ##       ##     ##  ##     ##    ##    ## 
	 ######  ##     ## ######## ########  ####    ##     ######  */



	credits:function(data){
		var screenElm 			= screen.new("credits");
		var overlayElm 			= $("<overlay>");
		var swirlElm			= $("<swirl>");
		
		//Append elements
		screenElm.append(overlayElm);
		screenElm.append(swirlElm);
		
		if(typeof applyOverlayViewport == "function"){
			applyOverlayViewport();
		}
		
		overlayElm[0].onclick = function(){
			screen.transition.fadeIn(function(){
				screenOverview()
			})
		}

		var credImage = new Image();
			credImage.src = "http://www.poocollectorgame.com/credits.png";

		credImage.onload = function(){
			overlayElm.css("background", "url(" + credImage.src + ")")
		}

		touch.bind(overlayElm[0]);

		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		
	},

	
	
	
	/*	
	##       ######## ##     ## ######## ##        ######  
	##       ##       ##     ## ##       ##       ##    ## 
	##       ##       ##     ## ##       ##       ##       
	##       ######   ##     ## ######   ##        ######  
	##       ##        ##   ##  ##       ##             ## 
	##       ##         ## ##   ##       ##       ##    ## 
	######## ########    ###    ######## ########  ######  */



	levels:function(data){
		var screenElm 			= screen.new("levels");
		var poonieElm 			= $("<poonie>");
		var levelsElm			= $("<levels>");
		var backBtn				= $("<back>");
		var userLevelsBtn		= $("<btn>").html("My levels").addClass("user-levels");
		
		game.testMode = false;

		//Create all levels and append them into levelsElm
		$(data.levels).each(function(i, level){
			var levelElm = $("<level>");
			var numElm = $("<num>").html(i+1);
			
			
			var hasSteps = game.levelIsClear(level.id);
			
			if(hasSteps){
				levelElm.html("<score>" + hasSteps + "</score>").addClass("cleared");
			}
			
			levelElm[0].onclick = function(){
				if(levels.existingLevels.indexOf(level) == 0){
					game.showTutorialOnStart();
				}

				screen.transition.fadeIn(function(){
					screen.clear();
					level.num = i;
					data.action(level);
				})
			}
			
			//Touch bind element
			touch.bind(levelElm[0]);
			
			//Append into levels holder
			levelsElm.append(levelElm);

			//Add number
			levelElm.append(numElm)
			
		})
		
		//Attach back action
		backBtn[0].onclick = function(){
			data.backAction();
		};
		
		userLevelsBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				screenUserLevels()
			})
		};
		
		touch.bind(backBtn[0]);
		touch.bind(userLevelsBtn[0]);
		
		if(levels.local.get("published").length == 0){
			userLevelsBtn.hide()
		}

		//Make it blink baby
		var blink = function(){
			poonieElm.addClass("blink");
			setTimeout(function(){
				poonieElm.removeClass("blink");
				setTimeout(blink, Math.floor((Math.random()*9000)+1))
			}, (Math.floor((Math.random()*150)+150)))
		}

		setTimeout(blink, 2000)
		
		//Append elements
		screenElm.append(levelsElm);
		screenElm.append(poonieElm);
		screenElm.append(backBtn);
		screenElm.append(userLevelsBtn)
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
	},









	/*
	##       ######## ##     ## ######## ##          ########     ###     ######  ##    ##  ######  
	##       ##       ##     ## ##       ##          ##     ##   ## ##   ##    ## ##   ##  ##    ## 
	##       ##       ##     ## ##       ##          ##     ##  ##   ##  ##       ##  ##   ##       
	##       ######   ##     ## ######   ##          ########  ##     ## ##       #####     ######  
	##       ##        ##   ##  ##       ##          ##        ######### ##       ##  ##         ## 
	##       ##         ## ##   ##       ##          ##        ##     ## ##    ## ##   ##  ##    ## 
	######## ########    ###    ######## ########    ##        ##     ##  ######  ##    ##  ######  */


	levelPacks:function(data){
		var screenElm 			= screen.new("levelPacks");
		var backBtn				= $("<back>");
		var beginnerElm			= $("<pack>").addClass("beginner");
		var deepForrestElm		= $("<pack>").addClass("deepForrest");
		var einsteinElm			= $("<pack>").addClass("einstein");
		var packsElms = [beginnerElm,deepForrestElm,einsteinElm];

		//Add class to add stepps animation
		if(data.justDone){
			screenElm.addClass(data.justDone)
		}

		$(packsElms).each(function(i, packElm){
			var scoreElm = $("<scoreelm>");
			var curPack = packs.get(i+1);

			scoreElm.html(curPack.levelsCompleted + " / " + curPack.levelCount)
			packElm.append(scoreElm)

			if(curPack.completed){
				packElm.addClass("completed");
				var pooElm = $("<completed>");
				var stepsElm = $("<steps>");

				packElm.append(pooElm);
				packElm.append(stepsElm);
			}

			//Add lock if pack is locked
			if(i>0){
				if(curPack.isLocked){
					console.log(i)
					var lockElm = $("<lock>");
					packElm.append(lockElm);
					scoreElm.remove();
				}
			}
		})

		//Attach back action
		backBtn[0].onclick = function(){
			data.backAction();
		};

		beginnerElm[0].onclick = function(){

			var curPack = packs.get(1);

			screen.transition.fadeIn(function(){
				if(curPack.levelsCompleted === 0){
					
					var firstLevel = curPack.getLevel(1);
					playGame(firstLevel)

					return false;
				}else{
					screen.pack({
						packId:1,
						backAction:screenLevelPacks
					})
				}
			})
		};

		deepForrestElm[0].onclick = function(){

			var curPack = packs.get(2);

			if(curPack.isLocked){
				
				navigator.notification.alert(
				    'You have to complete all levels in ' + packs.get(1).name + ' to unlock ' + packs.get(2).name + '!',  // message
				    function(){return false},         // callback
				    'Pack locked',            // title
				    'Okay then'                  // buttonName
				);

				return false;

			}
			

			screen.transition.fadeIn(function(){
				if(curPack.levelsCompleted === 0){
					
					var firstLevel = curPack.getLevel(1);
					playGame(firstLevel)

					return false;
				}else{
					screen.pack({
						packId:2,
						backAction:screenLevelPacks
					})
				}
			})
		};

		einsteinElm[0].onclick = function(){

			var curPack = packs.get(3);

			if(curPack.isLocked){
				
				navigator.notification.alert(
				    'You have to complete all levels in ' + packs.get(2).name + ' to unlock ' + packs.get(3).name + '!',  // message
				    function(){return false},         // callback
				    'Pack locked',            // title
				    'Okay then'                  // buttonName
				);

				return false;

			}
			
			screen.transition.fadeIn(function(){
				if(curPack.levelsCompleted === 0){
					
					var firstLevel = curPack.getLevel(1);
					playGame(firstLevel)

					return false;
				}else{
					screen.pack({
						packId:3,
						backAction:screenLevelPacks
					})
				}
			})
		};


		
		touch.bind(backBtn[0]);
		touch.bind(beginnerElm[0]);
		touch.bind(deepForrestElm[0]);
		touch.bind(einsteinElm[0]);

		//Append elements
		screenElm.append(backBtn);
		screenElm.append(beginnerElm);
		screenElm.append(deepForrestElm);
		screenElm.append(einsteinElm)
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
	},









/*
########     ###     ######  ##    ## 
##     ##   ## ##   ##    ## ##   ##  
##     ##  ##   ##  ##       ##  ##   
########  ##     ## ##       #####    
##        ######### ##       ##  ##        
##        ##     ## ##    ## ##   ##  
##        ##     ##  ######  ##    ## 
*/



pack:function(data){
		var screenElm 			= screen.new("levels").addClass("pack"+data.packId);
		var levelsElm			= $("<levels>");
		var backBtn				= $("<back>");
		
		//Get current pack
		var curPack = packs.get(data.packId);

		//Make sure game is not in test mode any more
		game.testMode = false;

		//Create all levels and append them into levelsElm
		$(curPack.levels).each(function(i, level){
			var levelElm = $("<level>")
			var numElm = $("<num>").html(level.num);
			
			//Add poo on level slot if completed
			if(level.completed){
				levelElm.html("<score>" + level.bestScore.steps + "</score>").addClass("cleared");

			}
			
			//Play level if user clicks
			levelElm[0].onclick = function(){

				screen.transition.fadeIn(function(){
					screen.clear();
					playGame(level);
				})
			}
			
			//Touch bind element
			touch.bind(levelElm[0]);
			
			//Append into levels holder
			levelsElm.append(levelElm);

			//Add number
			levelElm.append(numElm)
			
		})
		
		//Attach back action
		backBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.backAction();
			})
		};
				
		touch.bind(backBtn[0]);

		//Append elements
		screenElm.append(levelsElm);
		screenElm.append(backBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
	},





















	



	
	/*
	 ######      ###    ##     ## ########    ##     ## ######## ##    ## ##     ## 
	##    ##    ## ##   ###   ### ##          ###   ### ##       ###   ## ##     ## 
	##         ##   ##  #### #### ##          #### #### ##       ####  ## ##     ## 
	##   #### ##     ## ## ### ## ######      ## ### ## ######   ## ## ## ##     ## 
	##    ##  ######### ##     ## ##          ##     ## ##       ##  #### ##     ## 
	##    ##  ##     ## ##     ## ##          ##     ## ##       ##   ### ##     ## 
	 ######   ##     ## ##     ## ########    ##     ## ######## ##    ##  #######  */



	gameMenu:function(data){
		var screenElm 			= screen.new("game-menu");
		var menuHolderElm		= $("<menuholder>");
		var beatElm				= $("<beat>");
		var levelNameElm 		= $("<levelname>");
		var audioElm 			= $("<audiobtn>");

		var activeLevel = game.level;


		//Challenge mode
		if(game.isChallenge){
			$(screenElm).addClass("isChallenge");

            //Get current challenge
			var ch = challenges.get(game.isChallenge.id);
			
            //Write challenge steps into html
            beatElm.html("Score to beat <steps>" + (ch.received) ? ch.from.steps : ch.to.steps + "</steps>")
		}


		//Set action for music btn
		audioElm[0].onclick = function(){
			if(localStorage.music == undefined || localStorage.music == "true"){
				localStorage.music = "false";
				menuMusic.pause();
				audioElm.addClass("off");
				
			}else {
				localStorage.music = "true";
				menuMusic.play();
				audioElm.removeClass("off");
			}
		}
		
		if(localStorage.music == "false"){
			audioElm.addClass("off");
		}

		touch.bind(audioElm[0])

		levelNameElm.html(activeLevel.name)
		levelNameElm.addClass("pack" + activeLevel.pack.id);

		//Set game on pause
		game.pause();
		
		$(data.menuItems).each(function(i, item){
			var btnElm = $("<btn>");
				btnElm.html(item.text);
				btnElm.addClass(item.btnClass)
			
			if(!item.disabled){
				btnElm[0].onclick = function(){
					screen.clear();
					item.action();
				}
				
				touch.bind(btnElm[0])
			}
			
			if(item.disabled){
				btnElm.addClass("disabled")
			}
			
			menuHolderElm.append(btnElm);
		})
		
		
		
		//Append all to body
		screenElm.append(levelNameElm);
		screenElm.append(beatElm);
		screenElm.append(menuHolderElm);
		screenElm.append(audioElm);
		$("body").append(screenElm);
		
	},
	
	




	/*	
	##       ######## ##     ## ######## ##           ######  ##       ########    ###    ########  
	##       ##       ##     ## ##       ##          ##    ## ##       ##         ## ##   ##     ## 
	##       ##       ##     ## ##       ##          ##       ##       ##        ##   ##  ##     ## 
	##       ######   ##     ## ######   ##          ##       ##       ######   ##     ## ########  
	##       ##        ##   ##  ##       ##          ##       ##       ##       ######### ##   ##   
	##       ##         ## ##   ##       ##          ##    ## ##       ##       ##     ## ##    ##  
	######## ########    ###    ######## ########     ######  ######## ######## ##     ## ##     ## */



	levelClear:function(data){
		var screenElm 			= screen.new("level-clear");
		var poonieElm 			= $("<poonie>");
		var headerElm 			= $("<header>");
		var pooElm				= $("<poo>").html("<score>" + game.steps + "</score>");
		var swirlElm			= $("<swirl>");
			var nextBtn				= $("<btn>").html("Next").addClass("next");
			var levelsBtn			= $("<btn>").html("Levels").addClass("levels");

		
		var activeLevel = game.level;
		
		if(activeLevel.bestScore){
			if(activeLevel.bestScore.steps > game.steps){
				headerElm.addClass("highscore");
			}
		}

		//Attach touch actions
		nextBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.nextAction();
			})
		}
		
		levelsBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.levelsAction();
			})
		}
			



		//Make it blink baby
		var blink = function(){
			poonieElm.addClass("blink");
			setTimeout(function(){
				poonieElm.removeClass("blink");
				setTimeout(blink, Math.floor((Math.random()*9000)+1))
			}, (Math.floor((Math.random()*150)+150)))
		}

		setTimeout(blink, 2000)
		
		
		//Bind touch action
		touch.bind(nextBtn[0])
		touch.bind(levelsBtn[0])
		
		
	//Append elements
		screenElm.append(poonieElm);
		screenElm.append(headerElm);
		screenElm.append(swirlElm);
		screenElm.append(pooElm);
		screenElm.append(nextBtn);
		screenElm.append(levelsBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// OLD CHALLENGE ///////////////////////////////////////////////////////////////////////////////////////////////
	OLDchallenge:function(data){
		var screenElm 			= screen.new("challenge");
		var headerElm 			= $("<header>");
		var swirlElm	 		= $("<swirl>");
		var textElm 			= $("<text>").html("Challenge your friend to beat your score in this map");
		var yourNameElm 		= $("<input type='email'>").val("Your name or email").addClass("yourName");
		var theirEmailElm 		= $("<input type='email'>").val("Your friends email").addClass("theirEmail");
		
		var backBtn				= $("<btn>").html("Back").addClass("back");
		var sendBtn				= $("<btn>").html("Send").addClass("send");
		
		//Attach touch actions
		backBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.backAction();
			})
		}
		
		sendBtn[0].onclick = function(){
			touch.disabled = false;
			todo("Send challenge");
			
			screen.transition.fadeIn(function(){
				screen.challengeSent({
					action:data.sentAction
				})
			})
		}
		
		//Bind touch action
		touch.bind(sendBtn[0])
		touch.bind(backBtn[0])
		
		screen.usePlaceHolder(yourNameElm);
		screen.usePlaceHolder(theirEmailElm);
		
		//Append elements
		screenElm.append(swirlElm);
		screenElm.append(headerElm);
		screenElm.append(textElm);
		screenElm.append(yourNameElm);
		screenElm.append(theirEmailElm);
		screenElm.append(backBtn);
		screenElm.append(sendBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		touch.disabled = true;
		
	},
	
	
	
	


	
	/*	
	 ######  ##     ##    ###    ##       ##       ######## ##    ##  ######   ########     ######  ######## ##    ## ######## 
	##    ## ##     ##   ## ##   ##       ##       ##       ###   ## ##    ##  ##          ##    ## ##       ###   ##    ##    
	##       ##     ##  ##   ##  ##       ##       ##       ####  ## ##        ##          ##       ##       ####  ##    ##    
	##       ######### ##     ## ##       ##       ######   ## ## ## ##   #### ######       ######  ######   ## ## ##    ##    
	##       ##     ## ######### ##       ##       ##       ##  #### ##    ##  ##                ## ##       ##  ####    ##    
	##    ## ##     ## ##     ## ##       ##       ##       ##   ### ##    ##  ##          ##    ## ##       ##   ###    ##    
	 ######  ##     ## ##     ## ######## ######## ######## ##    ##  ######   ########     ######  ######## ##    ##    ##  */  



 	challengeSent:function(data){
		var screenElm 			= screen.new("challengesent");
		var headerElm 			= $("<header>");
		var cloudsElm 			= $("<clouds>");
		var paperflyElm 		= $("<paperfly>");
		var swirlElm	 		= $("<swirl>");
		
		setTimeout(function(){
			screen.transition.fadeIn(function(){
				data.action()
			})
		}, 3000)
		
		//Append elements
		screenElm.append(headerElm);
		screenElm.append(cloudsElm);
		screenElm.append(paperflyElm);
		screenElm.append(swirlElm);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		
	},
	
	
	
	
	
	
	
	
	
	/*	
	   ###    ##       ##          ##       ######## ##     ## ######## ##        ######      ######  ##       ########    ###    ########  
	  ## ##   ##       ##          ##       ##       ##     ## ##       ##       ##    ##    ##    ## ##       ##         ## ##   ##     ## 
	 ##   ##  ##       ##          ##       ##       ##     ## ##       ##       ##          ##       ##       ##        ##   ##  ##     ## 
	##     ## ##       ##          ##       ######   ##     ## ######   ##        ######     ##       ##       ######   ##     ## ########  
	######### ##       ##          ##       ##        ##   ##  ##       ##             ##    ##       ##       ##       ######### ##   ##   
	##     ## ##       ##          ##       ##         ## ##   ##       ##       ##    ##    ##    ## ##       ##       ##     ## ##    ##  
	##     ## ######## ########    ######## ########    ###    ######## ########  ######      ######  ######## ######## ##     ## ##     ## */



	finish:function(data){
		var screenElm 			= screen.new("finish");
		var clickElm 			= $("<clickarea>");
		
		if(data.type == "highscoremaster"){
			screenElm.addClass("highscoremaster")
		}
		
		clickElm[0].onmouseup = function(){
			screen.transition.fadeIn(function(){
				data.action();
			})
		}
		
		touch.bind(clickElm[0])


		//Append elements
		screenElm.append(clickElm);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		
	},
	





	
	
	/*
	######## ########  #### ########  #######  ########      #######  ##     ## ######## ########  ##     ## #### ######## ##      ## 
	##       ##     ##  ##     ##    ##     ## ##     ##    ##     ## ##     ## ##       ##     ## ##     ##  ##  ##       ##  ##  ## 
	##       ##     ##  ##     ##    ##     ## ##     ##    ##     ## ##     ## ##       ##     ## ##     ##  ##  ##       ##  ##  ## 
	######   ##     ##  ##     ##    ##     ## ########     ##     ## ##     ## ######   ########  ##     ##  ##  ######   ##  ##  ## 
	##       ##     ##  ##     ##    ##     ## ##   ##      ##     ##  ##   ##  ##       ##   ##    ##   ##   ##  ##       ##  ##  ## 
	##       ##     ##  ##     ##    ##     ## ##    ##     ##     ##   ## ##   ##       ##    ##    ## ##    ##  ##       ##  ##  ## 
	######## ########  ####    ##     #######  ##     ##     #######     ###    ######## ##     ##    ###    #### ########  ###  ###  */


	editorOverview:function(data){
		var screenElm 			= screen.new("editor-overview");
		var boardElm 			= $("<board>");
		var boardEndElm 		= $("<boardend>");
		var boardDinglerElm 	= $("<dingler>");
		var boxElm	 			= $("<box>");
		var boxInnerElm	 		= $("<inner>");
		var lampsElm 			= $("<lamps>");
		var poonieElm 			= $("<poonie>");
		
		var backBtn 			= $("<btn>").html("Back").addClass("back");
		var newBtn	 			= $("<btn>").html("New").addClass("new");
		
		var localLevels = levels.local.get("drafts");
		
		//If user has no levels in his local storage, start editor now and skip this screen
		if(localLevels.length == 0){
			screen.editor({
				new:true,
				level:levels.new(),
				backAction:screenOverview
			})
			return false;
		}
		
		var hasScrolled = false;
		var isDown = false;
		
		//Fill box with levels
		$(localLevels.reverse()).each(function(i, level){
			var levelElm = $("<levelitem>").html(level.name);
			
			levelElm[0].onmousedown = function(){
				isDown = true;
			}
			
			levelElm[0].onmousemove = function(){
				if(isDown){
					hasScrolled = true;
				}
			}
			
			levelElm[0].onmouseup = function(){
				if(!hasScrolled){
					
					levelElm.addClass("choosen")
					
					screen.transition.fadeIn(function(){
						screen.editor({
							new:false,
							level:level,
							backAction:screenEditorOverview
						})
					})
				}
				
				isDown = false;
				hasScrolled = false;
			}
			
			
			
			levelElm[0].ontouchstart = levelElm[0].onmousedown;
			levelElm[0].ontouchmove = levelElm[0].onmousemove;
			levelElm[0].ontouchend = levelElm[0].onmouseup;
			
			
			
			
			boxInnerElm.append(levelElm);
		})
		
		touch.scrollable(boxInnerElm);
		
		backBtn[0].onmouseup = function(){
			screen.transition.fadeIn(function(){
				data.backAction();
			})
		}
		
		newBtn[0].onmouseup = function(){
			screen.transition.fadeIn(function(){
				screen.editor({
					new:true,
					level:levels.new(),
					backAction:screenEditorOverview
				})
			})
		}
		
		touch.bind(backBtn[0]);
		touch.bind(newBtn[0]);
		
		//Append elements
		screenElm.append(boardElm);
		screenElm.append(boardEndElm);
		screenElm.append(boardDinglerElm);
		screenElm.append(boxElm.append(boxInnerElm));
		screenElm.append(lampsElm);
		screenElm.append(poonieElm);
		screenElm.append(backBtn);
		screenElm.append(newBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		
	},
	
	
	
	/*	
	######## ########  #### ########  #######  ########  
	##       ##     ##  ##     ##    ##     ## ##     ## 
	##       ##     ##  ##     ##    ##     ## ##     ## 
	######   ##     ##  ##     ##    ##     ## ########  
	##       ##     ##  ##     ##    ##     ## ##   ##   
	##       ##     ##  ##     ##    ##     ## ##    ##  
	######## ########  ####    ##     #######  ##     ## */


	editor:function(data){

		var tipHtml = "<h1>A Snippy snappy intro</h1><p><strong>Change background:</strong> Slide your finger from one end to the other to get another map background.</p><p><strong>Change item type:</strong> Press and hold anywhere on the map to get the item menu. In that, you can choose any specific item you want.</p>";
		
		var screenElm 				= screen.new("editor");
		var backgroundHolderElm 	= $("<backgroundholder>");
		var borderElm 				= $("<border>");
		var tipElm					= $("<tip>").html(tipHtml);
		var startBtn				= $("<btn>").html("Lets Go!").addClass("start");
		
		if(!data){
			data = {
				level:levels.local.get()[0]
			}
		}
		
		//Create editor and editor menus
		var editorObj = editor.new({
			level: (data.level ? data.level : editor.levels.new()),
			isNew:data.new
		})
		
		var menuObj = editor.menu.new({
			visible:true,
			backAction:data.backAction
		})
		
		var clickMenuObj = editor.clickMenu.new({
			visible:false
		})
		
		//get started button function
		startBtn[0].onmousedown = function(){
			tipElm.addClass("hide");
			editor.menu.toggle();
		}
		
		touch.bind(startBtn[0])
		
		
		//Append elements
		screenElm.append(backgroundHolderElm);
		screenElm.append(borderElm);
		screenElm.append(editorObj.element);
		screenElm.append(menuObj.element);
		screenElm.append(clickMenuObj.element);
		
		if(data.new && !data.isTesting){
			screenElm.append(tipElm);
			tipElm.append(startBtn);
		}
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
	},
	
	








	/*	
	 ######  ##     ##    ###    ##       ##       ######## ##    ##  ######   ######## 
	##    ## ##     ##   ## ##   ##       ##       ##       ###   ## ##    ##  ##       
	##       ##     ##  ##   ##  ##       ##       ##       ####  ## ##        ##       
	##       ######### ##     ## ##       ##       ######   ## ## ## ##   #### ######   
	##       ##     ## ######### ##       ##       ##       ##  #### ##    ##  ##       
	##    ## ##     ## ##     ## ##       ##       ##       ##   ### ##    ##  ##       
	 ######  ##     ## ##     ## ######## ######## ######## ##    ##  ######   ######## */


 	challenge:function(data){
		
		face.action({
			action:function(){

				screen.facebookFriends({
					action:function(choosenUser){
						alert(choosenUser)
					},
					backAction:data.backAction
				})

			},

			backAction:data.backAction
		})

		
	},










	/*	
	########    ###     ######  ######## ########   #######   #######  ##    ##    ######## ########  #### ######## ##    ## ########   ######  
	##         ## ##   ##    ## ##       ##     ## ##     ## ##     ## ##   ##     ##       ##     ##  ##  ##       ###   ## ##     ## ##    ## 
	##        ##   ##  ##       ##       ##     ## ##     ## ##     ## ##  ##      ##       ##     ##  ##  ##       ####  ## ##     ## ##       
	######   ##     ## ##       ######   ########  ##     ## ##     ## #####       ######   ########   ##  ######   ## ## ## ##     ##  ######  
	##       ######### ##       ##       ##     ## ##     ## ##     ## ##  ##      ##       ##   ##    ##  ##       ##  #### ##     ##       ## 
	##       ##     ## ##    ## ##       ##     ## ##     ## ##     ## ##   ##     ##       ##    ##   ##  ##       ##   ### ##     ## ##    ## 
	##       ##     ##  ######  ######## ########   #######   #######  ##    ##    ##       ##     ## #### ######## ##    ## ########   ######  */



	facebookFriends:function(data){

		var screenElm 			= screen.new("facebookFriends");
		var headerElm 			= $("<header>");
		var listElm				= $("<list>");
		var letterListElm		= $("<letters>");
		var poonieElm 			= $("<poonie>");
		
		var backBtn				= $("<btn>").html("Back").addClass("back");
		var shareBtn			= $("<btn>").html("Share").addClass("share");
		
		var lettersInUse = "abcdefghijklmnopqrstuwvxyz";
		
		var isDown = false;
		var isMoving = false;
		var hasMoved = false;

		var cLetter;

		backBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.backAction();
			})
		}



		touch.bind(backBtn[0])
		
		for(var i = 0; i<lettersInUse.length;i++){
			var letter = lettersInUse.substr(i, 1);
			var letterElm = $("<letter>").html(letter).attr("letter", letter);
			
			letterElm[0].onmousedown = function(){
				var splitterElm = $("#splitter_" + this.getAttribute("letter"));
				isDown = "letters";
				touch.unScrollable(listElm)
				
				if(splitterElm.exists()){
					var curScroll = splitterElm[0].offsetTop;
					listElm[0].scrollTop = curScroll;
				}
			}
			
			touch.bind(letterElm[0])
			letterListElm.append(letterElm);
		}
		
		touch.move(function(cords){
			
			if(!isDown){
				hasMoved = true;
			}

			if(isDown == "letters"){
				var startTop = letterListElm[0].offsetTop;
				var Y = cords.pageY - startTop;
				
				var letterSpaces = letterListElm[0].offsetHeight / lettersInUse.length;
				var letterPos = parseInt(Y / letterSpaces);
				
				if(letterPos >= lettersInUse.length){
					letterPos = lettersInUse.length - 1;
				}

				letterListElm.find("letter")[letterPos].onmousedown()
				
			}
		})
		
		
		var cLetter;
		$(face.friends()).each(function(i, person){
			var personElm = $("<person>").html(person.name).attr('userid', person.id);
			var curLetter = person.name.substr(0, 1).toLowerCase();
            
            //On mouse down on a fb users name
            personElm[0].onmousedown = function(){
                var userId = $(this).attr("userid");
                var userName = $(this).text();
                var thisElm = this;
                
                //Action if user presses ok
                var okFn = function(){
                    
                    //Add challenge to challenge object
                    challenges.add({
            			fromUserId:     face.userId,
            			toUserId:       userID,
            			toUserName:     userName,
            			levelId:        game.level.id,
                        action:         function(user){
                            if(user.isNew){
                                postOnFbUsersWall();
                            }
                        }
                    });
                    
                    //Change screen
                    screen.transition.fadeIn(function(){
                    	screen.challengeSent({
	                    	action:function(){
	                    		challengesOverview({
				                	backAction:function(){
					                    screenOverview();
					                }
					            });
	                    	}
	                    })
                    })
                }
                
                //Action if user clicks cancel
                var cancelFn = function(){
                    $(thisElm).removeClass("choosen");
                }
                
                //Post on facebook users wall
                function postOnFbUsersWall(){
                    
                    //Call FB api for post action
		            FB.api('/' + userId + '/feed', 'post', 
                    {
    	                message : face.firstName + ' has challenged you!',
    	                name : 'Poo Collector Game',
		                link : 'http://www.poocollectorgame.com',
		                description : face.firstName + ' just completed level ' + game.level.name + ' in Poo Collector Game with ' + highscores.getHighestByLevelId(game.level.id).steps + ' steps. Can you beat ' + ((face.gender == 'male') ? 'his':'her') + ' score!',
		                picture : 'http://www.poocollectorgame.com/fbicon.jpg'
                        
		            }, 
                    function(response){
                        console.log(response)
                    })
                };
                
                //Function for when the user clicks on this fb user name
                var clickFn = function(){
                    
                    //Mark item as choosen
                    $(thisElm).removeClass("choosen");
                    
                    //Popup an alert asking the user if he wants to challenge this user
                    navigator.notification.confirm('',
				        function(buttonIndex){
                            if(buttonIndex === 1){
				        		okFn()
				        	}else{
				        		cancelFn();
				        	}
				        }, 
				        'Challenge ' + userName + '?',
				        'Challenge,Cancel'
				    );
                    
                    //Reset hasMoved checker
                    hasMoved = false;
                }
                
                //Activate click function if users finger still have not moved after 100 ms
                setTimeout(function(){
                    if(!hasMoved){
                        clickFn();
                    }
                }, 100)
            }

            //Bind button to iphone
			touch.bind(personElm[0])
            
            //Add letter splitter line to list
			if(cLetter != curLetter){
				cLetter = curLetter;
				var splitterElm = $("<splitter>").html(curLetter).attr("id","splitter_" + cLetter);
				listElm.append(splitterElm)
			}
			
            //Append person to list
			listElm.append(personElm)
		})
		
        //Make list scrollable
		touch.scrollable(listElm)
		
        //Set screen global values on mouse up
		screenElm[0].onmouseup = function(){
			isDown = false;
			hasMoved = false;
			touch.scrollable(listElm)
		}
		
        //Bind screen element for iphone use
		touch.bind(screenElm[0])
		
		//Append elements
		screenElm.append(headerElm);
		screenElm.append(poonieElm);
		screenElm.append(listElm);
		screenElm.append(letterListElm);
		screenElm.append(backBtn);
		//screenElm.append(shareBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		
		
	},
	




	/*	
	 ######  ##     ##    ###    ##       ##       ######## ##    ##  ######   ########  ######      #######  ##     ## ######## ########  ##     ## #### ######## ##      ## 
	##    ## ##     ##   ## ##   ##       ##       ##       ###   ## ##    ##  ##       ##    ##    ##     ## ##     ## ##       ##     ## ##     ##  ##  ##       ##  ##  ## 
	##       ##     ##  ##   ##  ##       ##       ##       ####  ## ##        ##       ##          ##     ## ##     ## ##       ##     ## ##     ##  ##  ##       ##  ##  ## 
	##       ######### ##     ## ##       ##       ######   ## ## ## ##   #### ######    ######     ##     ## ##     ## ######   ########  ##     ##  ##  ######   ##  ##  ## 
	##       ##     ## ######### ##       ##       ##       ##  #### ##    ##  ##             ##    ##     ##  ##   ##  ##       ##   ##    ##   ##   ##  ##       ##  ##  ## 
	##    ## ##     ## ##     ## ##       ##       ##       ##   ### ##    ##  ##       ##    ##    ##     ##   ## ##   ##       ##    ##    ## ##    ##  ##       ##  ##  ## 
	 ######  ##     ## ##     ## ######## ######## ######## ##    ##  ######   ########  ######      #######     ###    ######## ##     ##    ###    #### ########  ###  ###  */



 	challengesOverview:function(data){
		var screenElm 			= screen.new("challengesOverview2");
		var listElm 			= $("<list>");
		var backBtn				= $("<btn>").html("Back").addClass("back");
        var statsElm            = $("<stats>");
        
		var hasMoved = false;
        var isDown = false;
        
        //Fill in stats
        var statsText = challenges.stats.won + " won, ";
            statsText += challenges.stats.lost + " lost & ";
            statsText += challenges.stats.draw + " draw";
        statsElm.html(statsText)
        
        function displayHeader(txt){
            var headerElm = $("<header>").text(txt);
            listElm.append(headerElm);
            
            return headerElm;
        }
        
        //Function for displaying an entire section
        function displayChallengeSection(userChallenges, preName, action){
            var sectionElm = $("<section>")
            var headerElm = $("<header>");
            var challengesElm = $("<challenges>");
            
            //Fill in headline
            headerElm.append($("<profilepic style='background-image:url(https://graph.facebook.com/" + userChallenges.user.id + "/picture)'>"))
            headerElm.append($("<headertext>").text(preName + " " + userChallenges.user.firstName));
            
            //Loop tru challenges from user and attach them to section
            $(userChallenges).each(function(i, challenge){
                var chElm = $("<challenge>");
                var chLevelElm = $("<level>");
                var chScoreElm = $("<score>");
                
                chLevelElm.text(challenge.level.name);
                chScoreElm.text(challenge.from.steps);
                
                chElm.append(chLevelElm);
                chElm.append(chScoreElm);
                challengesElm.append(chElm);
                
                chElm[0].onmouseup = function(){
                    if(hasMoved)return false;
                    
                    if(typeof action == "function"){
                        action(challenge);
                    }
                };
                
                touch.bind(chElm[0]);
            })
            
            //Append html
            sectionElm.append(headerElm);
            sectionElm.append(challengesElm);
            //listElm.append(sectionElm);
            return sectionElm;
        }
        
        
        function challengesSection(data){
            var currentSections = challenges.get(data.get);
            if(currentSections){
                if(currentSections.by)
                    currentSections = currentSections.by(data.sort);
            }
            
            if(currentSections){
                //Insert a header for all new items
                var challengesCount = challenges.stats[data.get];
                
                if(!challengesCount)return false;
                
                data.header = data.header.replace("#s#", (challengesCount!=1?"s":""));
                data.header = data.header.replace("#", challengesCount);
                
                data.header = data.header.replace("$s$", (currentSections.length!=1?"s":""));
                data.header = data.header.replace("$", currentSections.length);
                
                var headerElm = displayHeader(data.header)
                var sectionElm = $("<collapsesection>");
                
                //Create user section with challenges
                $(currentSections).each(function(i, userChallenges){
                    sectionElm.append(displayChallengeSection(userChallenges, data.sectionHeader, data.action));
                })
                
                listElm.append(sectionElm);
                
                if(data.collapsed){
                    sectionElm.hide();
                }
                
                headerElm[0].onmouseup = function(){
                    if(hasMoved)return false;
                    
                    sectionElm.slideToggle("slow");
                }
                
                touch.bind(headerElm[0]);
            }
        }
        
        
        challengesSection({
            get:"new",
            sort:"fromUsers",
            header:"# new challenge#s#",
            sectionHeader:"From",
            action:function(challenge){
                screen.transition.fadeIn(function(){
                    playChallenge(challenge);
                })
            }
        })
        
        
        challengesSection({
            get:"lost",
            sort:"users",
            header:"You have lost # challenge#s#",
            sectionHeader:"Lost to",
            action:function(challenge){
                screen.transition.fadeIn(function(){
                    playChallenge(challenge);
                })
            }
        })
        
       
        challengesSection({
            get:"waiting",
            sort:"toUsers",
            collapsed:true,
            header:"Waiting for $ friend$s$",
            sectionHeader:"Waiting for"
        })
        
        
        challengesSection({
            get:"won",
            sort:"users",
            collapsed:true,
            header:"You have won # challenge#s#",
            sectionHeader:"Won against"
        })
        
        
        
        
        

        
		

		backBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				if(data.backAction){
					data.backAction()
				}else{
					screenOverview()
				}
			})
		}

        //Bind touch on back button
		touch.bind(backBtn[0])
        
        //Make challenges list scrollable
		touch.scrollable(listElm)
        
        //Make global "hasMoved" equal with true when finger moves on screen
		touch.move(function(){
			if(isDown)
                hasMoved = true;
		})

        //Cancel "hasmoved" when finger dont touch the screen any more
		touch.up(function(){
			hasMoved = false;
            isDown = false;
		})
        
        touch.down(function(){
            isDown = true;
        })

		//Append elements
		screenElm.append(statsElm);
        screenElm.append(listElm);
		screenElm.append(backBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
	},
	






	/*
	 ######  ##     ##    ###    ##       ##       ######## ##    ##  ######   ########    ########   #######  ##    ## ######## 
	##    ## ##     ##   ## ##   ##       ##       ##       ###   ## ##    ##  ##          ##     ## ##     ## ###   ## ##       
	##       ##     ##  ##   ##  ##       ##       ##       ####  ## ##        ##          ##     ## ##     ## ####  ## ##       
	##       ######### ##     ## ##       ##       ######   ## ## ## ##   #### ######      ##     ## ##     ## ## ## ## ######   
	##       ##     ## ######### ##       ##       ##       ##  #### ##    ##  ##          ##     ## ##     ## ##  #### ##       
	##    ## ##     ## ##     ## ##       ##       ##       ##   ### ##    ##  ##          ##     ## ##     ## ##   ### ##       
	 ######  ##     ## ##     ## ######## ######## ######## ##    ##  ######   ########    ########   #######  ##    ## ######## */

	 challengeDone:function(data){
	 	var screenElm 			= screen.new("challengeDone");

		var headerElm           = $("<header>");
        var levelElm            = $("<levelname>");
        
        var youElm             = $("<user class='you'><steps></steps><poonie></poonie><name></name></user>");
        var himElm               = $("<user class='him'><steps></steps><poonie></poonie><name></name></user>");
        
		var againBtn			= $("<btn>").addClass("again").html("Try again");
		var challengesBtn		= $("<btn>").addClass("challenges").html("All challenges")
		var backBtn				= $("<btn>").addClass("back").html("Main menu");
        
        var challenge = data.challenge;
        var yourSteps = data.steps;
        
        var you = challenge.sent ? challenge.from : challenge.to;
        var him = challenge.sent ? challenge.to : challenge.from;
        
        //Set winner class
        if(yourSteps < him.steps){
            youElm.addClass("winner");
            headerElm.addClass("winner");
            
        }else if(yourSteps > him.steps){
            himElm.addClass("winner");
            
        }else if(yourSteps == him.steps){
            headerElm.addClass("draw");
            youElm.addClass("winner");
            himElm.addClass("winner");
        }
        
        //Set level name
        levelElm.text("in " + challenge.level.name);
        
        //fill to and from acording to data object
        youElm.find("steps").text(yourSteps);
        himElm.find("steps").text(him.steps);
        
        youElm.find("name").text("You");
        himElm.find("name").text(him.firstName);
        
        againBtn[0].onmousedown = function(){
            screen.transition.fadeOut(function(){
                playChallenge(challenge);
            })
        }
        
        challengesBtn[0].onmousedown = function(){
            screen.transition.fadeOut(function(){
                challengesOverview();
            })
        }
        
        backBtn[0].onmousedown = function(){
            screen.transition.fadeOut(function(){
                screenOverview();
            })
        }
    
        screenElm.append(youElm);
        screenElm.append(himElm);
        screenElm.append(headerElm);
        screenElm.append(levelElm);
		screenElm.append(againBtn);
		screenElm.append(challengesBtn);
		screenElm.append(backBtn);
        
        touch.bind(againBtn[0]);
        touch.bind(challengesBtn[0]);
        touch.bind(backBtn[0]);

		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();

	 },








	
	/*	
	########    ###     ######  ######## ########   #######   #######  ##    ##    ##        #######   ######   #### ##    ## 
	##         ## ##   ##    ## ##       ##     ## ##     ## ##     ## ##   ##     ##       ##     ## ##    ##   ##  ###   ## 
	##        ##   ##  ##       ##       ##     ## ##     ## ##     ## ##  ##      ##       ##     ## ##         ##  ####  ## 
	######   ##     ## ##       ######   ########  ##     ## ##     ## #####       ##       ##     ## ##   ####  ##  ## ## ## 
	##       ######### ##       ##       ##     ## ##     ## ##     ## ##  ##      ##       ##     ## ##    ##   ##  ##  #### 
	##       ##     ## ##    ## ##       ##     ## ##     ## ##     ## ##   ##     ##       ##     ## ##    ##   ##  ##   ### 
	##       ##     ##  ######  ######## ########   #######   #######  ##    ##    ########  #######   ######   #### ##    ## */



	facebookLogin:function(data){
		var screenElm 			= screen.new("facebook-login");
		var swirlElm			= $("<swirl>");
		var loginBtn			= $("<facelogin>");
		var backBtn				= $("<btn>").html("Back")
		
		loginBtn[0].onclick = function(){
			data.backAction();
			face.login(data.action)
		}

		backBtn[0].onclick = function(){
			screen.transition.fadeIn(function(){
				data.backAction()
			})
		}
		
		touch.bind(loginBtn[0])
		touch.bind(backBtn[0])
		
		//Append elements
		screenElm.append(swirlElm);
		screenElm.append(loginBtn);
		screenElm.append(backBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
		
	},
	
	
	
	
	
	
	
	/*	
	##     ## ######## ##       ########     ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
	##     ## ##       ##       ##     ##    ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
	##     ## ##       ##       ##     ##    ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
	######### ######   ##       ########     ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
	##     ## ##       ##       ##           ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
	##     ## ##       ##       ##           ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
	##     ## ######## ######## ##           ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  */

	usePlaceHolder:function(elm){
		
		var placeText = elm.val(); 
		
		elm[0].onclick = function(){
			if(this.value == placeText){
				$(this).addClass("withText")
				this.value = "";
			}
		}
		
		elm[0].onblur = function(){
			if(this.value == ""){
				$(this).removeClass("withText")
				this.value = placeText;
			}
		}
		
		touch.bind(elm[0])
	},
	
	
	elm:{
		btn:function(text, className){
			return $("<btn>").html(text).addClass(className);
		}
	},
	
	
new:function(className){
	screen.clear();
	var createdScreen = $("<screen>").addClass(className);
	if(typeof applyScreenViewport == "function"){
		createdScreen.css({
			"transform-origin":"0 0",
			"position":"absolute",
			"left": screenViewport.left + "px",
			"top": screenViewport.top + "px",
			"transform":"scale(" + screenViewport.scale + ")",
			"-webkit-transform":"scale(" + screenViewport.scale + ")"
		});
	}
	return screenElm = createdScreen;
},

	hasInputs:function(){
		var hasInputs = false;
		
		if($("screen input").length > 0){
			hasInputs = true;
		}
		
		return hasInputs;
	},
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	transition:{
		
		fadeIn:function(action){
			var transElm = $("trans").exists() ? $("trans").removeClass("fadeOut") : $("<trans>").addClass("fadeIn");
			$("body").append(transElm);
			if(typeof applyTransViewport == "function"){
				applyTransViewport();
			}
			
			setTimeout(function(){
				action();
			}, 250);
		},
		
		
		fadeOut:function(action){
			
			var transElm = $("trans");
			transElm.removeClass("fadeIn").addClass("fadeOut");
			
			setTimeout(function(){
				transElm.remove();
				if(typeof action == "function")
					action();
			}, 250);
		},
		
	},
	
	
	
	
	loader:function(data){
		
		//Set action if missing
		if(!data.action){
			data.action = data.next;
		}
		
		var time = data.time ? data.time : 3;
		var html = data.html ? data.html : false;
		
		screen.clear();
		var screenElm = $("<screen>");
		var headerElm = $("<header>");
		
		if(data.header){
			headerElm.html(data.header);
			screenElm.append(headerElm);
		}
		
		
		//Create fake load time
		setTimeout(function(){data.action()}, time * 1000)
		
		
		if(html != false){
			$(screenElm).append(html);
		}
		
		if(data.class){
		screenElm.addClass(data.class)
	}
	
	if(typeof applyScreenViewport == "function"){
		$(screenElm).css({
			"transform-origin":"0 0",
			"position":"absolute",
			"left": screenViewport.left + "px",
			"top": screenViewport.top + "px",
			"transform":"scale(" + screenViewport.scale + ")",
			"-webkit-transform":"scale(" + screenViewport.scale + ")"
		});
	}
	
	$("body").append(screenElm);
	screen.transition.fadeOut()
},

	
	
	clear:function(){
		$("screen").remove();
		
		//Enable touch gestures
		touch.enable();
	}
}












screenFlow = function(){
    screen.intro({
        action:function(){
            
            screenOverview()
            
        }
    })
}


screenLevelPacks = function(data){
    if(!data)data={};

    screen.levelPacks({
        justDone:data.justDone ? data.justDone : false,
        backAction:function(){
            screen.transition.fadeIn(function(){
                screenOverview();
            })
        }
    })
}


screenOverview = function(){
    game.clear()
    screen.overview({
        
        playAction:function(){
            if(packs.get(1).levelsCompleted === 0){
                playGame(packs.get(1).getLevel(1));
            }else{
                screenLevelPacks();
            }
        },
        
        creditAction:function(){
            screen.transition.fadeIn(function(){
                screen.credits();
            })
        }
    })
}



screenEditorOverview = function(){
    screen.editorOverview({
        backAction:function(){
            screenOverview();
        }
    })
}



screenUserLevels = function(){
    screen.userLevels({})
}





challengesOverview = function(data){
    screen.challengesOverview(data)
}







