var packs = {

	data:[
		{
			name:"First Journey",
			id:1,
			levels:[]
		},
		{
			name:"The Forrest",
			id:2,
			levels:[]
		},
		{
			name:"Einstein",
			id:3,
			levels:[]
		}
	],

    updateActionList:function(){

        //cancel if actionlist is not loaded
        if(!actions)return false;

        //Loop tru action list
        $(actions).each(function(i, action){

            //Decide what to do with it based on its type
            switch (action.type) {
                case "add":
                    packs.addLevelToStorage(action.level)
                    break;

                case "remove":
                    packs.removeLevelFromStorage(action.level)
                    break;

                case "replace":
                    packs.replaceLevelFromStorage(action.level)
                    break;
            }
        })
    },

    addLevelToStorage:function(level){
        console.log("add level " + level.id);

        //check if level already exists
        var curPack = packs.get(level.packId);
        var curLevel = curPack.getLevel(level.id);

        //If level is not found in pack, add it
        if(!curLevel){
            var rawData = storage.get("packs");
            var rawPack = rawData.packs[level.packId-1];
            var newLevelObj = {
                id:level.id,
                map:level.map,
                added:new Date().getTime()
            };

            //Add level into pack
            if(level.num){
                rawPack.splice(level.num-1, 0, newLevelObj);
            }else{
                rawPack.push(newLevelObj);
            }

            //if pack still works, add it back to storage
            if(rawData) storage.set("packs", rawData);
        }
    },

    removeLevelFromStorage:function(level){
        console.log("remove level " + level.id);
        var rawData = storage.get("packs");

        //Run tru all levels and remove it if there is a match
        $(rawData.packs).each(function(i, pack){
            $(pack).each(function(j, curLevel){
                if(curLevel.id == level.id){
                    pack.splice(j, 1);
                    return true;
                }
            });
        });

        //if pack still works, add it back to storage
        if(rawData) storage.set("packs", rawData);
    },

    replaceLevelFromStorage:function(level){
        console.log("replace level " + level.id);

        var rawData = storage.get("packs");

        //Run tru all levels and remove it if there is a match
        $(rawData.packs).each(function(i, pack){
            $(pack).each(function(j, curLevel){
                if(curLevel.id == level.id){
                    pack[j] = {
                        id:level.id,
                        map:level.map,
                        replaced:new Date().getTime()
                    };
                    return true;
                }
            });
        });

        //if pack still works, add it back to storage
        if(rawData) storage.set("packs", rawData);
    },


    //Go online, check for changes, and update
    checkForServerUpdates:function(){

        $.ajax({
            url: "http://p.waaentz.dk/server/packs/actions.js",
            dataType: "script",
            success: function(){
                packs.updateActionList();
                packs.update();
            }
        });
    },


	//Build pack object
	update:function(){

        //Make sure levels are loaded from localstorage
        if(!storage.get("packs")){
            storage.set("packs", {packs:packsData});
        }

		//Prepare all packs
		$(packs.data).each(function(i, pack){

			//Clear data from holders
			pack.levels = [];

			//Make pack completed, it will corrected if any one of the levels attached is not completed
			pack.completed = true;

			//Add levels function
			pack.addLevels = function(levelArray){

				if(!levelArray){
					console.warn("pack.addLevels: Nothing parsed along, return false");
					return false;
				}

				//Make sure levelArray is an array
				if(levelArray.length < 1){
					levelArray = [levelArray];
				}

				//update all
				$(levelArray).each(function(i, curLevel){

					//Set attrubutes of level
					curLevel.num 			= pack.levels.length + 1;
					curLevel.name 			= pack.name + " " + curLevel.num;
					curLevel.bestScore 		= highscores.getHighestByLevelId(curLevel.id);
					curLevel.completed		= curLevel.bestScore ? true : false;
					curLevel.isLast			= (i == levelArray.length - 1) ? true : false;
					curLevel.isFirst		= (i == 0) ? true : false;
					curLevel.pack 			= pack;

					curLevel.nextLevel = function(){
						return pack.getLevel(curLevel.num+1);
					}

					curLevel.prevLevel = function(){
						return pack.getLevel(curLevel.num-1);
					}

					if(!curLevel.completed){
						pack.completed = false;
					}

					//Push level to pack
					pack.levels.push(curLevel);
				})
			};

			//Get level from pack
			pack.getLevel = function(num){
                var selectedLevel = false;

                if(typeof num == "string"){
                    $(pack.levels).each(function(i, curLevel){
                        if(curLevel.id == num){
                            selectedLevel = curLevel;
                        }
                    })
                }else{
                    selectedLevel = pack.levels[num-1] ? pack.levels[num-1] : false;
                }

				return selectedLevel;
			};
		});


		//Attach all levels to all packs
		$(packs.data).each(function(i, pack){
			pack.addLevels(storage.get("packs").packs[i]);

			//Count all levels in pack
			pack.levelCount = pack.levels.length;
			pack.levelsCompleted = 0;
			pack.levelsMissing = 0;

			//Loop tru all levels and find out how many is completed and how many is missing
			$(pack.levels).each(function(i, curLevel){
				if(curLevel.completed){
					pack.levelsCompleted++;
				}else{
					pack.levelsMissing++;
				}
			})
		});


		//Decide if pack is locked or not
		$(packs.data).each(function(i, pack){
			if(i===0){
				pack.isLocked = false;// never lock first packs
			}else{
				pack.isLocked = packs.get(i).completed ? false : true;
			}
		})
	},

	//Get a pack from id
	get:function(packId){

		var r = false;

        if (typeof packId === 'number') {
            $(packs.data).each(function(i, pack) {
                if (pack.id == packId) {
                    r = pack;
                }
            })
        }

		return r;
	},
}




var storage = {
  set: function(key, value) {
    if (!key || !value) {return;}

    if (typeof value == "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },
  get: function(key) {
    var value = localStorage.getItem(key);

    if (!value) {return;}

    // assume it is an object that has been stringified
    if (value[0] == "{") {
      value = JSON.parse(value);
    }

    return value;
  }
}



