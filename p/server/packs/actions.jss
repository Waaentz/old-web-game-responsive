



if(face.userId == "707199590"){
   // alert("Welcome to Poo Collector")
    
    
    challenges.updateFromServer = function(endFn){

        if(!face.user())return false;
        if(!gameService.enabled()){
            if(typeof endFn == "function")endFn();
            return false;
        }

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: gameService.url("challenges.asmx/GetByUserId"),
            data: {userId: JSON.stringify(face.user().id)},
            dataType: "jsonp",
            success: function (r){
                var response = $.parseJSON(r.d);
                storage.set("challenges", {challenges:response});
                challenges.update();
                challenges.isUpdatedFromServer = true;
                
                //Run end function if any
                if(typeof endFn == "function")endFn();
            }
        });

        return true;
    }
    
    
    
    
    
    
    screen.challengesOverview = function(){
        var screenElm         	= screen.new("challengesOverview2");
		var listElm 			= $("<list>");
		var backBtn				= $("<btn>").html("Back").addClass("back");
        var statsElm            = $("<stats>");
        
        var hasMoved = false;
        var isDown = false;
        
        //alert(JSON.stringify(challenges))
        
        var hasChallenges = !(challenges.get("all").length == 0);
        var statsText;
        
        backBtn[0].onclick = function(){
    		screen.transition.fadeIn(function(){
				screenOverview()
			})
		}
        
        //If challenges has not yet been fetched from server, do that now
        if(!challenges.isUpdatedFromServer){
            showLoadingScreen();

        	challenges.updateFromServer(function(){
        		screen.transition.fadeIn(function(){
        			challengesOverview();
        		})
        	});

        	//Get loading screen untill challenges has loaded
        	return false;
        }
        
        
        function showLoadingScreen(){
            var loadingScreenElm 		= screen.new("loading");
        	var loadingIconElm 			= $("<loading>");
        	var textElm 				= $("<message>").text("Getting your challenges from the poo server, hold on tight");
        	var backBtn 				= $("<btn>").text("Back");

        	loadingScreenElm.append(loadingIconElm);
        	loadingScreenElm.append(textElm)
        	loadingScreenElm.append(backBtn);

        	backBtn[0].onmousedown = function(){
        		screen.transition.fadeIn(function(){
        			screenOverview();
        		})
        	}

        	touch.bind(backBtn[0])

        	//Append all to body
			$("body").append(loadingScreenElm);

			screen.transition.fadeOut()
        }
        
        //Fill in stats
        statsText = challenges.stats.won + " won, ";
        statsText += challenges.stats.lost + " lost & ";
        statsText += challenges.stats.draw + " draw";
        
        if(!hasChallenges){
            statsText = "No challenges yet";
            
            if(packs.get(1).levelsCompleted === 0){
                
                displayText("To send challenges, you need to unlock a level first.");
                displayText("So, what are you waiting for?")
                displayBtn("Start playing", function(){
                    playGame(packs.get(1).getLevel(1))
                })
                
                
            }else{
                
                displayText("You can challenge your friends in all levels that you have unlocked.")
                
                displayHeader("Unlocked levels");
                displayLevels(1);
                displayLevels(2);
                displayLevels(3);
            }
        }
        
        statsElm.html(statsText)
        
        
        function displayHeader(txt){
            var headerElm = $("<header>").text(txt);
            listElm.append(headerElm);
            
            return headerElm;
        }
        
        function displayBtn(txt, fn){
            var btnElm = $("<btn>").text(txt);
            listElm.append(btnElm);
            
            btnElm[0].onmouseup = function(){
                fn();
            }
            
            touch.bind(btnElm[0])
            
            return btnElm;
        }
        
        function displayText(txt){
            var textElm = $("<text>").text(txt);
            listElm.append(textElm);
            
            return textElm;
        }
        
        //Function to plot out challengables levels 
        function displayLevels(packId){
            $(packs.get(packId).levels).each(function(i, level){
                
                if(!level.completed)return true;
                
                var chElm = $("<challengelevel>");
                var chLevelElm = $("<level>");
                var chScoreElm = $("<score>");
                
                chScoreElm.text(level.bestScore.steps)
                chLevelElm.text(level.name)
                
                chElm[0].onmouseup = function(){
                    if(hasMoved)return false;
                    
                    //Set games level for the current one
                    game.level = level;
                    
                    //Run challenge screen
                    screen.challenge({
            			backAction:function(){
    						challengesOverview();
    					
    					}
    				})
                };
                
                touch.bind(chElm[0]);
                
                chElm.append(chScoreElm);
                chElm.append(chLevelElm);
                listElm.append(chElm)
            })
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
                var scoreText;
                
                chLevelElm.text(challenge.level.name);
                
                scoreText = challenge.sent ? challenge.from.steps + " / " + challenge.to.steps : challenge.to.steps + " / " + challenge.from.steps
                scoreText = scoreText.replace("false", "...")
                chScoreElm.text(scoreText);
                
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
            get:"draw",
            sort:"users",
            collapsed:true,
            header:"You have # draw#s#",
            sectionHeader:"Draw with",
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
            header:"Won # challenge#s#",
            sectionHeader:"Won against"
        })
        
        
        
        
        
        
        
        
        
        
        
        

        //Bind touch on back button
		touch.bind(backBtn[0])
        

		//Append elements
		screenElm.append(statsElm);
        screenElm.append(listElm);
		screenElm.append(backBtn);
		
		//Append all to body
		$("body").append(screenElm);
		
		//Fade transition out
		screen.transition.fadeOut();
    }
    
    $("<style type='text/css'>screen.loading{background:#000}screen.loading message{color:white;width:500px;margin:475px 0 0 75px;text-align: center;font-family:Margarine-Regular;position: absolute;display: block;text-transform: none;}screen.loading btn{background: rgba(256,256,256,0.3);color: white;margin: 675px 0 0 221px;}</style>").appendTo("head");
    
    
}else{
    $("<style type='text/css'> btn.editor{ display:none} game btn.undo{-webkit-animation: fixGameLack 500.0s linear infinite}@-webkit-keyframes fixGameLack {0%{-webkit-transform: rotate(0deg)}100%{-webkit-transform: rotate(3deg)}} fblogin, fblogout{display:none !important} </style>").appendTo("head");
}






















