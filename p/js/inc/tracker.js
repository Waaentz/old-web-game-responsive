///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TRACKER ////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

var tracker = {
	highscores:{
		setAll:function(JSONobj){
			if(JSONobj.length > 0)
				localStorage.highscores = JSON.stringify({scores:JSONobj});
		},
		
		getAll:function(){
			if(!localStorage.highscores)localStorage.highscores = '{"scores":[]}';
			var JSONobj = $.parseJSON(localStorage.highscores);
			return JSONobj.scores;
		},

		getHighestByLevelId:function(id){
			var highestScore = false;

			$(highscores.getAll()).each(function(i, score){
				if(id == score.levelId){
					if(highestScore.steps > score.steps || highestScore === false){
						highestScore = score;
					}
				}
			})

			return highestScore;
		},
		
		add:function(data){

			var allScores = this.getAll();
			var userTrail = [];
			var userTrailString = '';

			//modify trail
			if(typeof data.mapTrack == 'object'){
				$(data.mapTrack).each(function(i, trailObj){
					userTrailString += '[' + trailObj.unitArray[0].position[0] + ',' + trailObj.unitArray[0].position[1] + '],';
				})
			}else if(typeof data.mapTrack == 'string'){
				userTrailString = data.mapTrack;
			}

			var newHighscoreItem = {
				levelId:  		data.levelId,
            	userId:  		face.userId ? face.userId : 0,
            	steps:  		data.steps,
            	timespend:  	data.timespend,
            	mapTrack:  		userTrailString,
				challengeId: 	data.challengeId ? data.challengeId : ''
			}

			//Save highscore local
			if(newHighscoreItem.steps > 0){
				allScores.push(newHighscoreItem)
				this.setAll(allScores);
			}

			if(!gameService.enabled()){
				return;
			}
			$.ajax(
            {
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: gameService.url("highscores.asmx/Create"),
                data: {
                	levelId:  		JSON.stringify(newHighscoreItem.levelId),
	            	userId:  		JSON.stringify(newHighscoreItem.userId),
	            	steps:  		JSON.stringify(newHighscoreItem.steps),
	            	timespend:  	JSON.stringify(newHighscoreItem.timespend),
	            	mapTrack:  		JSON.stringify(newHighscoreItem.mapTrack),
					challengeId: 	JSON.stringify(newHighscoreItem.challengeId)
                },

                dataType: "jsonp",
                success: function (savedata)
                {

                	//log("online")
                    var savejson = $.parseJSON(savedata.d);
                    log("#### Gem highscore online ############################################")
                    log(savejson);
                    log("######################################################################")

                    newHighscoreItem.highscoreId = savejson.HighscoreId;

                    //log(newHighscoreItem)

                    //allScores.push(newHighscoreItem);
					//highscores.setAll(allScores);

					game.highscoreId = savejson.HighscoreId;
                },

                error: function (savedata)
                {

                    log("#### ERROR highscore online ############################################")
                    log(savedata);
                    log("######################################################################")
                }
            });

		},
	},


	
	levelStats:{
		setAll:function(JSONobj){
			localStorage.levelsPlayed = JSON.stringify({levels:JSONobj});
			//log(localStorage.levelsPlayed + " has been sat");
		},
		
		getAll:function(){
			if(!localStorage.levelsPlayed)localStorage.levelsPlayed = '{"levels":[]}';
			var JSONobj = $.parseJSON(localStorage.levelsPlayed);
			return JSONobj.levels;
		},
		
		add:function(data){
			var allLevelsPlayed = this.getAll();
			
			allLevelsPlayed.push({
				guid:			createUUID(),
				levelId:		data.levelId,
				steps:			data.steps,
				timeUsed:		data.timeUsed,
				datePlayed:		data.datePlayed
			})
			
			this.setAll(allLevelsPlayed);
		},
	},
	
	challenges:{
		setAll:function(JSONobj){
			localStorage.challenges = JSON.stringify({challenges:JSONobj});
		},
		
		getAll:function(){
			if(!localStorage.challenges)localStorage.challenges = '{"challenges":[]}';
			var JSONobj = $.parseJSON(localStorage.challenges);
			return JSONobj.challenges;
		},

		getByLevelId:function(id){
			var all = this.getAll();

			var r = [];

			$(all).each(function(i, ch){
				
				var levelId = ch.Level ? ch.Level.LevelId : false;
				if(levelId == id){

					r.push({
						toName: 		ch.ToUser ? ch.ToUser.UserName : 'User not found',
						toId: 			ch.ToUser ? ch.ToUser.UserId : '0',
						toScore: 		ch.ToUserHighscore ? ch.ToUserHighscore.Steps : '-',
						fromScore: 		ch.FromUserHighscore ? ch.FromUserHighscore.Steps : '-',
						fromName: 		ch.FromUser ? ch.FromUser.UserName : 'User not found',
						fromId: 		ch.FromUser ? ch.FromUser.UserId : '0',
						challengeId: 	ch.ChallengeId,
						levelId: 		ch.Level.LevelId,
						levelName: 		ch.Level.LevelName,
						levelPackName: 	ch.Level.LevelPack.LevelPackName
					})
				}
			})

			return r;
		},

		getById:function(id){
			var all = this.getAll();

			var r = false;

			$(all).each(function(i, ch){
				
				if(ch.ChallengeId == id){

					r = {
						toName: 		ch.ToUser ? ch.ToUser.UserName : 'User not found',
						toId: 			ch.ToUser ? ch.ToUser.UserId : '0',
						toScore: 		ch.ToUserHighscore ? ch.ToUserHighscore.Steps : '-',
						fromScore: 		ch.FromUserHighscore ? ch.FromUserHighscore.Steps : '-',
						fromName: 		ch.FromUser ? ch.FromUser.UserName : 'User not found',
						fromId: 		ch.FromUser ? ch.FromUser.UserId : '0',
						challengeId: 	ch.ChallengeId,
						levelId: 		ch.Level.LevelId,
						levelName: 		ch.Level.LevelName,
						levelPackName: 	ch.Level.LevelPack.LevelPackName
					}
				}
			})

			return r;
		},

		update:function(data){

			if(!gameService.enabled()){
				if(data.action){
					data.action(challenges.getAll())
				}
				return;
			}

			if(data.action){
				data.action(challenges.getAll())
			}

			$.ajax(
	            {
	                type: "GET",
	                contentType: "application/json; charset=utf-8",
	                url: gameService.url("challenges.asmx/GetByUserId"),
	                data: {
	                	userId: JSON.stringify(data.userId)
	                },

	                dataType: "jsonp",
	                success: function (returnData)
	                {
	                	log("Nu er den opdateret")
	                    var returnjson = $.parseJSON(returnData.d);
	                    challenges.setAll(returnjson);

	                    if(data.action){
	                    	data.action(returnjson)
	                    }


	                    var chCount = 0;

						$(returnjson).each(function(i, ch){
		                    if(!ch.ToUserHighscore && ch.FromUser.UserId != face.user().id){
		                        chCount++
		                    }
		                })

		                challenges.newCount = chCount;

	                }
	            });
		},
		
		add:function(data){
			var allChallenges = this.getAll();
			
			var thisChallenge = {
				fromUserId:		data.fromUserId,
				toUserId: 		data.toUserId,
				levelId: 		data.levelId
			}

			if (navigator.network.connection.type == Connection.NONE) {
			    
			    //allChallenges.push(thisChallenge)
				//this.setAll(allScores)

			} else {
				

				//Create friend in database
				if(!gameService.enabled()){
					if(data.action){
						data.action({
							notifyOnFacebook:false,
							steps: highscores.getHighestByLevelId(thisChallenge.levelId).steps
						})
					}
					return;
				}
				$.ajax(
	            {
	                type: "GET",
	                contentType: "application/json; charset=utf-8",
	                url: gameService.url("users.asmx/Create"),
	                data: { 
	                	userName: 		JSON.stringify(data.toUserName),
	                	userId:  		JSON.stringify(data.toUserId),
	                	userEmail:  	JSON.stringify(''),
	                	deviceId:  		JSON.stringify('')
	                },
	                dataType: "jsonp",
	                success: function (savedata)
	                {
	                    var savejson = $.parseJSON(savedata.d);
	                    console.log(savejson);

	                    //Run action function
	                    if(data.action){
	                    	data.action({
	                    		notifyOnFacebook:(savejson.DeviceId == "") ? true : false,
	                    		steps: highscores.getHighestByLevelId(thisChallenge.levelId).steps
	                    	})
	                    }

	                    //Create challenge in database
	                    $.ajax(
			            {
			                type: "GET",
			                contentType: "application/json; charset=utf-8",
			                url: gameService.url("challenges.asmx/Create"),
			                data: {
			                	fromUserId:		JSON.stringify(data.fromUserId),
								toUserId: 		JSON.stringify(data.toUserId),
								levelId: 		JSON.stringify(data.levelId)
			                },

			                dataType: "jsonp",
			                success: function (savedata)
			                {
			                    var savejson = $.parseJSON(savedata.d);

			                    thisChallenge.challengeId = savejson.ChallengeId;

								//Create highscore to add to this challenge
								var curScore = highscores.getHighestByLevelId(thisChallenge.levelId)

								curScore.challengeId = savejson.ChallengeId;
								highscores.add(curScore)
			                }
			            });
	                }
	            });
			};
		},
	}

}


//Create shortcuts
var highscores = tracker.highscores
var levelStats = tracker.levelStats
var challenges = tracker.challenges








function sendData(){
	var sendBtn = $("<btn>").html("Send analyse til Tobias").addClass("sendAnalyse");
	var formElm = $("<form method='post' action='analyse.php'>");

	var highscoresInput = $("<input name='Highscores' type='hidden'>").val(localStorage.highscores);
	var levelsStatsInput = $("<input name='LevelStats' type='hidden'>").val(localStorage.levelsPlayed);

	formElm.append(highscoresInput);
	formElm.append(levelsStatsInput);

	sendBtn[0].onclick = function(){
		formElm[0].submit()
	}

	touch.bind(sendBtn[0])

	$("screen").append(sendBtn);
	$("screen").append(formElm);
}

































