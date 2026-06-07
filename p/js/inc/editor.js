///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EDITOR /////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


var editor = {
	
	level:null,
	activeItemObj:null,
	
	new:function(data){
		var element = $("<editor>");
		this.element = element;
		var isDown = false;
		var isMove = false;
		var isDelete = false;
		var firstDeletedItem = {};
		editor.isNew = data.isNew;
		
		log(editor.isNew)
		
		game.testMode = false;
		
		$("body").append(element);
		
		//Load level
		this.loadLevel(data.level);
		
		element[0].onmousemove = function(e){
			
			if(isDown){
				isMove = true;
				this.onmousedown(e);
			}
		}
		
		element[0].onmouseup = function(e){

			isDown = false;
			isDelete = false;
			isMove = false;
			firstDeletedItem = {};
			
			$("map .tobeDeleted").remove();
			editor.map.removeItemsInArray();
			editor.unmark();

			setTimeout(function(){
				editor.map.renderWater()
			}, 10)
			

		}
		
		
		//Create touch functions
		element[0].onmousedown = function(e){
			
			itemToDelete = false;
			add = false;
			
			//Hide menu if it is active
			if(editor.menu.show){
				editor.menu.hide();
			}
			
			//Get current position of field
			var pos = editor.getFieldPositionFromTouch([e.pageX, e.pageY]);
			
			//Get item from field if any
			var curItem = editor.map.getField(pos);
			
			
			if(curItem && !isMove){
				itemToDelete = curItem;
			}
			
			if(curItem && isDelete && curItem.objType == firstDeletedItem.objType){
				itemToDelete = curItem;
			}
			
			
			if(curItem.hasBox && editor.activeItemObj.itemType == "box"){
				itemToDelete = curItem.hasBox;
			}
			
			if(firstDeletedItem.objType == "box" && curItem.hasBox){
				itemToDelete = curItem.hasBox;
			}
			
			if(curItem.objType == "fieldItem" && !curItem.hasBox && editor.activeItemObj.itemType == "box"){
				add = true;
				itemToDelete = false;
			}
			
			
			//If nothin there, add it
			if(!curItem && editor.activeItemObj.itemType != "unit"){
				add = true;
				hasBox = false;
			}
			
			
			//If new and current type is the same, do nothing
			if(curItem.objType ==  editor.activeItemObj.itemType){
				add = false;
				hasBox = false;
			}
			
			
			if(curItem.isGoal && editor.activeItemObj.itemType == "box" && !curItem.hasBox){
				add = true;
				hasBox = true;
			}
			
			
			if((!curItem || (curItem.isGoal && !curItem.hasBox)) && editor.activeItemObj.itemType == "unit"){
				add = true;
				itemToDelete = false;
			}
			
			
			if(firstDeletedItem.objType == "item" && curItem.objType != "item"){
				itemToDelete = false;
			}
			
						
			//Set isDelete true if first item is deleted
			if(itemToDelete && !isMove && !isDelete  && !(editor.activeItemObj.itemType == "fieldItem" && curItem.objType == "box")){
				isDelete = true;
				firstDeletedItem = itemToDelete;
			}
			
			if(editor.activeItemObj.itemType == "fieldItem" && curItem.objType == "box"){
				add = true;
				itemToDelete = false;
			}
			
			editor.mark({pos:pos, isDelete:isDelete})
			
			
			if(isDelete){
				
				if(curItem){ 
				
					if(itemToDelete.objType == "box"){
						curItem.hasBox = false;
						curItem.element.removeClass("clear");
					}
					
					if(itemToDelete){
						editor.map.addToRemoveArray(itemToDelete);
						itemToDelete.element.addClass("tobeDeleted")
					}
				}
				
			}else if(add) {
				
				var newItem = editor.map.add({
					pos:pos,
					objType:editor.activeItemObj.itemType,
					version:editor.activeItemObj.versions[Math.floor((Math.random()*(editor.activeItemObj.versions.length-1)))]
				})
				
				//If poo is on fielditem
				if((curItem.objType == "box" && newItem.objType == "fieldItem")){
					newItem.hasBox = curItem;
					newItem.element.addClass("clear");
				
				}else if((curItem.objType == "fieldItem" && newItem.objType == "box")){
					curItem.hasBox = newItem;
					curItem.element.addClass("clear");
				}
			}
			
			isDown = true;
		}
		
		touch.bind(element[0])
		
		
		var r = {
			element:element
		}
		
		
		this.obj = r;
		return r;
	},
	
	mark:function(data){
		var markerElm = $("editor mark").exists() ? $("editor mark") : $("<mark>");
		
		if(data.isDelete){
			markerElm.addClass("isDelete")
		}
		
		markerElm.css("margin", editor.map.fieldSize * data.pos[1] + "px 0 0 " + editor.map.fieldSize * data.pos[0] + "px");
		
		$("editor").append(markerElm);
	},
	
	unmark:function(data){
		$("editor mark").remove()
	},
	
	
	loadLevel:function(level){
		//Create shortcut and clear current map
		this.level = level;
		$("editor map").remove();
		
		//Create map from level.map
		this.map = mapObject(level.map)
		
		//Append map to game
		$("editor").append($(this.map.element))
		applyMapViewport();
	},
	
	
	
	getFieldPositionFromTouch:function(position){
		if(!this.map)return false;
		
		var x = parseInt(position[0] / this.map.fieldSize);
		var y = parseInt(position[1] / this.map.fieldSize);
		
		return [x,y];
	},
	
	clear:function(){
		$("editor").remove();
		$("screen.editor").remove();
		this.level = null;
		this.activeItemObj = null;
	},
	
	
	
	
	//MENU//////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	menu:{
		show:false,
		
		new:function(data){
			var element 				= $("<editormenu>").addClass("hide");
			var topMenuElm 				= $("<topmenu>");
			var itemTypesHolderElm 		= $("<itemtypesholder>");
			var showMeElm		 		= $("<showme>");
			var backBtn					= $("<btn>").html("Back").addClass("back");
			var saveBtn					= $("<btn>").html("Save").addClass("save");
			var playHolderElm			= $("<playholder>")
			var playBtn					= $("<btn>").addClass("play").html("Test play")
			
			var r;
			
			showMeElm[0].onmousedown = function(){
				editor.menu.toggle();
			}
			
			backBtn[0].onclick = function(){
				screen.transition.fadeIn(function(){
					data.backAction();
				})
			}
			
			playBtn[0].onclick = function(){
				
				var hasError = editor.map.isValid();
				
				if(hasError.isError){
					
					editor.alert({
						header:"Map is not playable!",
						body:hasError.message("play"),
						btn:"OK"
					})
					
					return false;
				}
				
				editor.testModePlayLevel();
			}
			
			saveBtn[0].onclick = function(){
				//screen.transition.fadeIn(function(){
					
					editor.level.map = editor.map.export();
					
					log(editor.map.export())
					var hasError = editor.map.isValid();
					
					if(hasError.isError){
						
						editor.alert({
							header:"Map is not playable!",
							body:hasError.message("save"),
							btn:"OK"
						})
						
						return false;
					}
					
					if(editor.isNew){
						editor.saveScreen(
							
							function(levelName){
								editor.level.name = levelName;
								levels.local.add(editor.level)
								editor.isNew = false;
								
								//Load game after 1 secund
								setTimeout(function(){
									editor.wantToPublishScreen();
								}, 1000)
								
							}
							
						)
					}else {
						levels.local.update(editor.level);
						editor.savedScreen();
						
						//Load game after 1 secund
						setTimeout(function(){
							editor.wantToPublishScreen();
						}, 1000)
					}
					
			}
			
			touch.bind(playBtn[0])
			touch.bind(saveBtn[0])
			touch.bind(showMeElm[0])
			touch.bind(backBtn[0])
			
			//Build top menu and current item menu
			$(editor.items).each(function(i, menuItem){
				
				var menuItemElm 		= $("<menuitem>").html(menuItem.name);
				var itemTypeHolderElm 	= $("<itemtypeholder>");
				var innerElm			= $("<itemsinner>");
				
				menuItemElm[0].onclick = function(){
					r.activate(i)
				}
				touch.bind(menuItemElm[0])
				
				$(menuItem.types).each(function(j, typeItem){
					var typeItemElm = $("<typeitem>");
					
					typeItemElm.css("backgroundImage", "url(graphic/map-items/" + typeItem.versions[0] + ".png)");
					
					typeItemElm[0].onclick = function(){
						editor.activateItem(editor.items[i].types[j]);
						$("typeitem").removeClass("active");
						$(this).addClass("active");
					}
					
					touch.bind(typeItemElm[0])
					
					innerElm.append(typeItemElm);
				})

				innerElm.css("width", menuItem.types.length * 150)
				
				topMenuElm.append(menuItemElm)
				itemTypeHolderElm.append(innerElm);
				itemTypesHolderElm.append(itemTypeHolderElm)
			})
			
			//Append topMenu to menu element
			element.append(topMenuElm);
			element.append(itemTypesHolderElm);
			element.append(showMeElm);
			element.append(backBtn);
			element.append(saveBtn);
			element.append(playHolderElm.append(playBtn))
			
			r = {
				element:element,
				activate:function(num){
					//Activate menu
					$(topMenuElm.find("menuitem").removeClass("active").get(num)).addClass("active");
					
					//Activate item holder
					$(itemTypesHolderElm.find("itemtypeholder").removeClass("active").get(num)).addClass("active");
				}
			}
			
			//Activate first item
			r.activate(0);
			editor.activateItem(editor.items[0].types[0]);
			
			this.menu = r;
			return r;
		},
		
		hide:function(){
			$("editormenu").addClass("hide").removeClass("show");
			if($("editormenu").exists())
				this.show = false;
		},
		
		toggle:function(){
			if($("editormenu").hasClass("hide")){
				$("editormenu").addClass("show").removeClass("hide");
				this.show = true;
			}else{
				$("editormenu").addClass("hide").removeClass("show");
				this.show = false;
			}
		}
	},
	
	clickMenu:{
		new:function(data){
			var element = $("<editorclickmenu>");
			
			var r = {
				element:element
			}
			
			this.clickMenu = r;
			return r;
		}
	},
	
	saveScreen:function(func){
		var screenElm = $("<savescreen>");
		var innerElm = $("<inner>");
		var headerElm = $("<header>").html("Done!?");
		var textElm = $("<text>").html("Save your level and share it with others. But before you can share it, you have to complete it your self.")
		var inputElm = $("<input maxlength='20'>").val(editor.level.name);
		var backBtn = $("<btn>").html("Back").addClass("back");
		var saveBtn = $("<btn>").html("Save").addClass("save");
		
		screen.usePlaceHolder(inputElm);
		
		innerElm.append(headerElm)
		innerElm.append(textElm)
		innerElm.append(inputElm)
		innerElm.append(backBtn)
		innerElm.append(saveBtn)
		screenElm.append(innerElm)
		$("screen.editor").append(screenElm)
		
		backBtn[0].onmouseup = function(){
			screenElm.remove();
			touch.disabled = false;
		}
		
		saveBtn[0].onmouseup = function(){
			func(inputElm.val());
			screenElm.remove();
			editor.savedScreen()
			touch.disabled = false;
		}
		
		touch.bind(backBtn[0]);
		touch.bind(saveBtn[0]);
		
		touch.disabled = true;
	},
	
	wantToPublishScreen:function(){
		var screenElm = $("alert.wantToPublish").exists() ? $("alert.wantToPublish") : $("<alert>").addClass("wantToPublish");
		var innerElm = $("<inner>");
		var headerElm = $("<header>").html("Publish now?");
		var textElm = $("<text>").html("You have to complete the level your self before you can publish it.")
		var backBtn = $("<btn>").html("Keep editing").addClass("back");
		var playBtn = $("<btn>").html("Play to publish").addClass("play");
		
		innerElm.append(headerElm)
		innerElm.append(textElm)
		
		innerElm.append(playBtn)
		innerElm.append(backBtn)
		
		screenElm.append(innerElm)
		$("screen.editor").append(screenElm)
		
		backBtn[0].onmouseup = function(){
			screenElm.remove();
			touch.disabled = false;
		}
		
		playBtn[0].onmouseup = function(){
			editor.playLevel();
		}
		
		touch.bind(backBtn[0]);
		touch.bind(playBtn[0]);
		
	},
	
	
	alert:function(data){
		var alertElm = $("<alert>");
		var headerElm = $("<header>").html(data.header);
		var textElm = $("<text>").html(data.body);
		var btnElm = $("<btn>").html(data.btn);
		
		btnElm[0].onmouseup = function(){
			alertElm.remove();
		}
		
		touch.bind(btnElm[0])
		
		alertElm.append(headerElm)
		alertElm.append(textElm)
		alertElm.append(btnElm)
		$("screen.editor").append(alertElm);
	},
	
	savedScreen:function(func){
		var screenElm = $("<savescreen>").addClass("saved");
		var iconElm = $("<icon>");

		screenElm.append(iconElm)
		$("screen.editor").append(screenElm)
		
		setTimeout(function(){
			screenElm.remove();
			editor.wantToPublishScreen();
		}, 1300)
		
	},
	
	activateItem:function(itemObj){
		this.activeItemObj = itemObj;
		editor.menu.hide();
	},
	
	playLevel:function(testMode){
		
		game.editMode = true;
		game.testMode = testMode ? true : false;
		game.isNew = editor.isNew;
		
		game.menuAction(function(){
			
			//Set editor mode to normal
			game.editMode = false;
			game.onMenuFunc = null;
			
			//Save current level
			var cLevel = game.level;
			
			//Clear game
			game.clear();
			
			//Load current level into editor again
			screen.editor({
				level:cLevel,
				new:game.isNew,
				isTesting:true,
				backAction:screenEditorOverview
			})
			
		})

		
		//Start game with current level
		editor.level.map = editor.map;
		
		game.start(editor.level)
		editor.clear();
	},
	
	
	testModePlayLevel:function(){
		
		this.playLevel(true)

	},
	
	items:[
		{
			name:"Block",
			types:[
				{
					name:"Stone",
					itemType:"item",
					versions:[
						"stone-1",
						"stone-2",
						"stone-3",
						"stone-4",
						"stone-5",
						"stone-6",
						"stone-7",
						"stone-8",
						"stone-9",
						"stone-10",
						"stone-11",
						"stone-12",
						"stone-13",
						"stone-14",
						"stone-15"
					]
				},
				
				{
					name:"Tree",
					itemType:"item",
					versions:[
						"tree-1",
						"tree-2",
						"tree-3",
						"tree-4",
						"tree-5",
						"tree-6",
						"tree-7",
						"tree-8",
						"tree-9",
						"tree-10"
					]
				},
				
				{
					name:"Tree Chunks",
					itemType:"item",
					versions:[
						"tree-chunks-1",
						"tree-chunks-2",
						"tree-chunks-3",
						"tree-chunks-4"
					]
				},
				
				{
					name:"Mushrooms",
					itemType:"item",
					versions:[
						"mushroom-1",
						"mushroom-2",
						"mushroom-3",
						"mushroom-4"
					]
				},
				{
					name:"Water",
					itemType:"item",
					versions:[
						"water-1"
					]
				}
			]
		},
//		{
//			name:"Field",
//			types:[
//				{
//					name:"Dirt Spot",
//					itemType:"fieldItem",
//					versions:[
//						"dirt-1"
//					]
//				}
//			]
//		},
		{
			name:"User",
			types:[
				{
					name:"Poo",
					itemType:"box",
					versions:[
						"poo-1"
					]
				},
				
				{
					name:"Goal",
					itemType:"fieldItem",
					versions:[
						"goal-1"
					]
				},
				
				{
					name:"User",
					itemType:"unit",
					versions:[
						"user"
					]
				}
			]
		}
	]
}



























































