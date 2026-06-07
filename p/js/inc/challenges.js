var challenges = {
    data:[],
    stats:{
        won:0,
        lost:0,
        draw:0,
        sent:0,
        received:0,
        unplayed:0,
        played:0,
        new:0,
        total:0,
        waiting:0
    },
    
    resetStats:function(){
        $(Object.keys(challenges.stats)).each(function(i, key){
            challenges.stats[key] = 0;
        });
    },
    
    updateFromServer:function(endFn){
        if(!gameService.enabled()){
            storage.set("challenges", {challenges: []});
            challenges.update();
            if(typeof endFn == "function")endFn();
            return;
        }
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: gameService.url("challenges.asmx/GetByUserId"),
            data: {userId: JSON.stringify(face.userId)},
            dataType: "jsonp",
            success: function (r){
                var response = $.parseJSON(r.d);
                storage.set("challenges", {challenges:response});
                challenges.update();
                
                //Run end function if any
                if(typeof endFn == "function")endFn();
            }
        });
    },
    
    add:function(challengeData){
        
        //Create toUser in database (if user already exists, that will be used instead)
        server.createUser({
            id:     challengeData.toUserId,
            name:   challengeData.toUserName,
            
            endFn:function(response){
                
                //Run end function
                challengeData.action({
                	isNew:(response.DeviceId == "") ? true : false
            	})
                
                //Now create challenge in database
                server.createChallenge({
                    fromUserId: challengeData.fromUserId,
                    toUserId:   challengeData.toUserId,
                    levelId:    challengeData.levelId,
                    
                    endFn:function(response){
                        
                        //Save highscore and add challenge id to it
                        var curScore = highscores.getHighestByLevelId(challengeData.levelId)
        				curScore.challengeId = response.ChallengeId;
    					highscores.add(curScore);
                    }
                });
            }
        });
    },
    
    update:function(){
        
        //Get raw data from localstorage or an empty array if nothing is in storage for challenges
        var rawData = (storage.get("challenges")) ? storage.get("challenges").challenges : [];
        
        //Clear any old data in challenges data array
        challenges.data = [];
        challenges.resetStats();
        
        //Add all challenges to data array
        $(rawData).each(function(i, challenge){
            
            //Make sure only full challenges get added
            if(!challenge.Level || !challenge.ToUser || !challenge.FromUser || !challenge.FromUserHighscore){
                return true;
            }
            
            var ch = {
                
                id: challenge.ChallengeId,
                
                from:{
                    userName:   challenge.FromUser.UserName,
                    id:         challenge.FromUser.UserId,
                    email:      challenge.FromUser.UserEmail,
                    created:    challenge.FromUser.Created,
                    deviceId:   challenge.FromUser.DeviceId,
                    steps:      (challenge.FromUserHighscore) ? challenge.FromUserHighscore.Steps : false
                },
                
                to:{
                    userName:   challenge.ToUser.UserName,
                    id:         challenge.ToUser.UserId,
                    email:      challenge.ToUser.UserEmail,
                    created:    challenge.ToUser.Created,
                    deviceId:   challenge.ToUser.DeviceId,
                    steps:      (challenge.ToUserHighscore) ? challenge.ToUserHighscore.Steps : false
                }
            };
            
            ch.level = {
                id:         challenge.Level.LevelId,
                map:        challenge.Level.LevelMap,
                name:       challenge.Level.LevelName,
                pack:{
                    id:     challenge.Level.LevelPack.LevelPackId,
                    name:   challenge.Level.LevelPack.LevelPackName
                }
            }
            
            ch.from.firstName   = ch.from.userName.split(" ")[0];
            ch.to.firstName     = ch.to.userName.split(" ")[0];
            
            ch.sent =           (face.userId == ch.from.id);
            ch.received =       !ch.sent;
            
            ch.won =            false;
            ch.lost =           false;
            ch.draw =           false;
            ch.isPlayed =       (ch.to.steps !== false);
            
            if(ch.isPlayed){
                //Determen winner state of challenge
                var you = (!ch.sent) ? ch.to : ch.from;
                var him = (ch.sent) ? ch.to : ch.from;
                
                if(you.steps < him.steps){
                    ch.won = true;
                }else if(you.steps > him.steps){
                    ch.lost = true;
                }else if(you.steps == him.steps){
                    ch.draw = true;
                }
            }
            
            ch.new = (ch.received && !ch.isPlayed);
            
            //Update challenges stats
            challenges.stats.total++;
            if(ch.won)challenges.stats.won++;
            if(ch.new)challenges.stats.new++;
            if(ch.lost)challenges.stats.lost++;
            if(ch.draw)challenges.stats.draw++;
            if(ch.sent)challenges.stats.sent++;
            if(ch.received)challenges.stats.received++;
            if(ch.isPlayed){
                challenges.stats.played++;
            }else{
                challenges.stats.unplayed++;
            }
            if(!ch.isPlayed && ch.sent)challenges.stats.waiting++;
            
            challenges.data.push(ch);
        });
        
    },
    
    get:function(target){
        console.log(target)
        var r = [];
        
        //Update challenges data localy
        challenges.update();
        
        //Get all into memory
        var all = challenges.data;
        
        //Run tru all and decide what to do
        $(all).each(function(i, challenge){
            
            switch(target){
                case "all":
                    r.push(challenge);
                    break;
                
                case "lost":
                    if(challenge.lost){
                        r.push(challenge);
                    }
                    break;
                
                case "won":
                    if(challenge.won){
                        r.push(challenge);
                    }
                    break;
                    
                case "draw":
                    if(challenge.draw){
                        r.push(challenge);
                    }
                    break;
                
                case "unplayed":
                    if(!challenge.isPlayed){
                        r.push(challenge);
                    }
                    break;
                    
                case "waiting":
                    if(!challenge.isPlayed && challenge.sent){
                        r.push(challenge);
                    }
                    break;
                    
                case "played":
                    if(challenge.isPlayed){
                        r.push(challenge);
                    }
                    break;
                    
                case "sent":
                    if(challenge.sent){
                        r.push(challenge);
                    }
                    break;
                    
                case "received":
                    if(challenge.received){
                        r.push(challenge);
                    }
                    break;
                    
                case "new":
                    if(challenge.new){
                        r.push(challenge);
                    }
                    break;
                
                default:
                    //Check if item has a match in id
                    if(challenge.id == target){
                        r = challenge;
                    }
                    break;
            }
        });
        
        //If return is an array, add sort functions at it
        if(r.length > 0){
            r.by = function(sortType){
                switch (sortType) {
                    case "users":
                        var userArray = [];
                        $(r).each(function(i, challenge){
                            
                            //If user does not exist in array, create him
                            var usersId = (challenge.sent ? challenge.to.id : challenge.from.id);
                            
                            if(!userArray[usersId]){
                                userArray[usersId] = [];
                                userArray[usersId].user = (challenge.sent ? challenge.to : challenge.from);
                            }
                            
                            //Add current challenge to users array
                            userArray[usersId].push(challenge);
                        });
                        
                        //Clear return object
                        r = [];
                        $(Object.keys(userArray)).each(function(i, userId){
                            r.push(userArray[userId]);
                        });
                        break;
                        
                    case "fromUsers":
                        var userArray = [];
                        $(r).each(function(i, challenge){
                            
                            //If user does not exist in array, create him
                            if(!userArray[challenge.from.id]){
                                userArray[challenge.from.id] = [];
                                userArray[challenge.from.id].user = challenge.from;
                            }
                            
                            //Add current challenge to users array
                            userArray[challenge.from.id].push(challenge);
                        });
                        
                        //Clear return object
                        r = [];
                        $(Object.keys(userArray)).each(function(i, userId){
                            r.push(userArray[userId]);
                        });
                        break;
                    
                    case "toUsers":
                        var userArray = [];
                        $(r).each(function(i, challenge){
                            
                            //If user does not exist in array, create him
                            if(!userArray[challenge.to.id]){
                                userArray[challenge.to.id] = [];
                                userArray[challenge.to.id].user = challenge.to;
                            }
                            
                            //Add current challenge to users array
                            userArray[challenge.to.id].push(challenge);
                        });
                        
                        //Clear return object
                        r = [];
                        $(Object.keys(userArray)).each(function(i, userId){
                            r.push(userArray[userId]);
                        });
                        break;
                    
                }
                
                return r;
            };
        }
        
        return (r) ? r : false;
    }
};



//challenges.get("id");
//challenges.get("all");
//challenges.get("loses");
//challenges.get("wins");
//challenges.get("draws");
//challenges.get("unplayed");
//challenges.get("played");
//challenges.get("received");
//challenges.get("sent");
//
//challenges.stats.update()
//challenges.stats.won;
//challenges.stats.lost;
//challenges.stats.draw;
//challenges.stats.sent;
//challenges.stats.received;
//challenges.stats.unplayed;
//challenges.stats.played;
//challenges.stats.new




var server = {
    createUser:function(data){
        if(!gameService.enabled()){
            if(typeof data.endFn == "function"){
                data.endFn({DeviceId: "", IsNew: false})
            }
            return;
        }
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: gameService.url("users.asmx/Create"),
            data: { 
                userName:     	JSON.stringify(data.name),
                userId:  		JSON.stringify(data.id),
                userEmail:  	JSON.stringify(''),
                deviceId:  		JSON.stringify('')
            },
            dataType: "jsonp",
            success: function (savedata){data.endFn($.parseJSON(savedata.d))}
            
        });
    },
    
    createChallenge:function(data){
        if(!gameService.enabled()){
            if(typeof data.endFn == "function"){
                data.endFn({ChallengeId: "offline-" + (+new Date())})
            }
            return;
        }
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: gameService.url("challenges.asmx/Create"),
            data: {
            	fromUserId:		JSON.stringify(data.fromUserId),
				toUserId: 		JSON.stringify(data.toUserId),
				levelId: 		JSON.stringify(data.levelId)
            },

            dataType: "jsonp",
            success: function (savedata){data.endFn($.parseJSON(savedata.d))}
        });
    }
}




var test = 
{
    ChallengeId: "5837aa00-1deb-4cf6-becc-0fddab90747b",
    
    FromUser: {
      UserName: "Peter Konoy",
      UserId: "764449556",
      UserEmail: "",
      Created: "2012-12-25T08:46:59.157",
      DeviceId: "76EE7376-5E85-4CD3-B02B-87795D97BF84"
    },
    
    ToUser: {
      UserName: "Tobias Waaentz",
      UserId: "707199590",
      UserEmail: "",
      Created: "2012-11-23T19:09:35.62",
      DeviceId: "FD2C5B27-52C2-4E9E-B37A-A72863818390"
    },
    
    Level: null,
    Created: "2013-01-06T13:55:55.913",
    FromUserHighscore: {
      HighscoreId: "0aeb7abc-859e-49e0-871d-f6a52f7282a4",
      UserId: "764449556",
      Steps: 36
    },
    ToUserHighscore: null
}






