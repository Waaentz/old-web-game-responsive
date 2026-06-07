///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAP ////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mapObject(data){
	
	if(typeof data == "string"){
		data = $.parseJSON(data)
	}
	
	var size 			= data.size ? data.size : [30,20];
	var type 			= data.type ? data.type : "normal";
	var items 			= data.items ? data.items : [];
	var fieldItems 		= data.fieldItems ? data.fieldItems : [];
	var boxes 			= data.boxes ? data.boxes : [];
	var units 			= data.units ? data.units : [];
	var fieldSize 		= data.fieldSize ? data.fieldSize : 30;
	
	var r = {
		size:		size,
		type:		type,
		items:		[],		//Items, boxes and units will be filled out during .build
		fieldItems:	[],
		boxes:		[],
		units:		[],
		fieldSize: 	fieldSize,
		user:		null,
		element:	null,
		itemsToRemoveArray:[],
		
		build:function(){
			
			this.element 			= $("<map>");
			var cols 				= this.size[0];
			var rows 				= this.size[1];
			var fieldSize 			= (rows > cols) ? mobile.screen.height / rows : mobile.screen.width / cols;
				this.fieldSize 		= fieldSize;
			var itemsHolder 		= $("<items>");
			var fieldItemsHolder 	= $("<fielditems>");
			var boxesHolder 		= $("<boxes>");
			var unitsHolder 		= $("<units>");
			var fieldsHolder 		= $("<fields>");
			
			var map = this.element;
			
			//Make global ref's
			this.itemsHolder 		= itemsHolder;
			this.fieldItemsHolder 	= fieldItemsHolder;
			this.boxesHolder 		= boxesHolder;
			this.unitsHolder 		= unitsHolder;
			
			//Create rows and add fields
//			for(var i=0;i<rows;i++){
//				
//				var row = $("<row>").height(fieldSize);
//				$(fieldsHolder).append(row);
//				
				//Create fields
//				for(var j=0;j<cols;j++){
//					
//					var field = $("<field>").height(fieldSize).width(fieldSize);//.html(j + i);
//					$(row).append(field);
//				}
//			}
			
			
			//Add fieldItems to fieldItem tag
			for(var i=0;i<fieldItems.length;i++){
				this.addFieldItem(fieldItems[i])
			}
			
			
			//Add items to item tag
			for(var i=0;i<items.length;i++){
				this.addItem(items[i])
			}
			
			
			//Add boxes to item tag
			for(var i=0;i<boxes.length;i++){
				this.addBox(boxes[i])
			}
			
			
			//Add units (user figure f.ex)
			for(var i=0;i<units.length;i++){
				this.addUnit(units[i]);
			}
			
			
			//Append holders to map tag
			map.append(fieldsHolder);
			map.append(fieldItemsHolder);
			map.append(itemsHolder);
			map.append(boxesHolder);
			map.append(unitsHolder);
			
			return this;
		},
		
		add:function(data){
			
			var dataObj = {position:data.pos,type:data.version}
			var newItem;
			
			
			if(data.objType == "item"){
				newItem = this.addItem(dataObj)
				
			}else if (data.objType == "box") {
				newItem = this.addBox(dataObj)
				
			}else if (data.objType == "fieldItem") {
				newItem = this.addFieldItem(dataObj)
				
			}else if (data.objType == "unit") {
				newItem = this.addUnit(dataObj)
				
			}
			
			//log(newItem)
			
			return newItem;
			
		},
		
		addItem:function(item){
			
			//Create item object and html element
			var itemElm = $("<item>").addClass(item.type).append($("<inner>"));
			var itemObj = itemObject(item);
			
			//Push item to item list 
			this.items.push(itemObj)
			
			//Set current map
			itemObj.map = this;
			
			//Get position
			var x = itemObj.position[0];
			var y = itemObj.position[1];

			itemObj.x = x;
			itemObj.y = y;
			
			//Set item's element
			itemObj.element = itemElm;
			
			//Set style of item's element
			itemElm.css("marginLeft", this.fieldSize *x).css("marginTop", this.fieldSize *y).css("zIndex", this.getZindex([x,y])).addClass(itemObj.type)
			itemElm.width(this.fieldSize).height(this.fieldSize);
			
			//Append item's element to map's item tag 
			this.itemsHolder.append(itemElm);

			return itemObj;
		},
		
		addFieldItem:function(item){
			
			//Create item object and html element
			var itemElm = $("<fielditem>").addClass(item.type);
			var itemObj = fieldItemObject(item);
			var innerElm = $("<inner>");
			
			//Push item to item list 
			this.fieldItems.push(itemObj)
			
			//Set current map
			itemObj.map = this;
			
			//Get position
			var x = itemObj.position[0];
			var y = itemObj.position[1];
			
			if(item.isGoal){
				var flagElm = $("<flagpoleholder>").css("zIndex", this.getZindex([x,y]));
				flagElm.append($("<flagholder>")).append($("<flagpole>")).append($("<flag>"))
				innerElm.append(flagElm)
			}
			
			//Set item's element
			itemObj.element = itemElm;
			
			//Set style of item's element
			itemElm.css("marginLeft", this.fieldSize *x).css("marginTop", this.fieldSize *y)
			itemElm.width(this.fieldSize).height(this.fieldSize);
			
			//Append item's element to map's item tag 
			this.fieldItemsHolder.append(itemElm.append(innerElm));
			
			return itemObj;
		},
		
		addBox:function(box){
			//Create box object and html element
			var boxElm = $("<box>").addClass(box.type).append($("<inner>").append($("<inside>")));
			var boxObj = boxObject(box);
			
			//Push box to box list 
			this.boxes.push(boxObj)
				
			//Set current map	
			boxObj.map = this;
			
			//Get position
			var x = boxObj.position[0];
			var y = boxObj.position[1];
			
			//Set box's element
			boxObj.element = boxElm;
			
			//Set style of box element
			boxElm.css("marginLeft", this.fieldSize *x).css("marginTop", this.fieldSize *y).css("zIndex", this.getZindex([x,y])).addClass(boxObj.type)
			boxElm.width(this.fieldSize).height(this.fieldSize);
			
			//Append box element to map's box Holder
			this.boxesHolder.append(boxElm);
			
			//Check if box is on top of goal
			$(this.fieldItems).each(function(i, fieldItem){
				
				if(fieldItem.position[0] == boxObj.position[0] && fieldItem.position[1] == boxObj.position[1]){
					fieldItem.hasBox = boxObj;
					fieldItem.element.addClass("clear");
				}
			})
			
			return boxObj;
		},
		
		addUnit:function(unit){
			
			//Create unit object and element
			var unitElm = $("<unit>").append($("<inner>"));
			var unitObj = unitObject(unit);
			
			if(this.user){
				unitObj = this.user;
				unitObj.position = unit.position;
				unitElm = this.user.element;
			}
			
			//Create body of unit
			var boodyHolderElm 	= $("<boodyholder>");
			unitElm.append(boodyHolderElm)
			
			
			//Push unit to unit list
			this.units = [unitObj]
			
			//Set current map
			unitObj.map = this;
			
			//Get position
			var x = unitObj.position[0];
			var y = unitObj.position[1];
			
			//Set units element
			unitObj.element = unitElm;
			
			//Check if unit is current user. If it is, use current user obj instead
			if(unitObj.isUser && this.user){
				unitObj = this.user;
				unitElm = this.user.element;
			}
			
			//Set unit element
			unitObj.element = unitElm;
			
			//Set style for unit
			unitElm.css("marginLeft", this.fieldSize *x).css("marginTop", this.fieldSize *y).css("zIndex", this.getZindex([x,y]) + 2).addClass(unitObj.type)
			unitElm.width(this.fieldSize).height(this.fieldSize);
			
			//Append unit to map's unit holder
			this.unitsHolder.append(unitElm);
			
			//set maps user to this one if its the user
			//if(unitObj.isUser){
				this.user = unitObj;
				unitElm.addClass("user");
			//};
			
			
			
			return unitObj;
		},
		
		removeFieldItem:function(item){
			$(this.fieldItems).each(function(i, cItem){
				if(item === cItem){
					item.element.remove();
					item.map.fieldItems.splice(i, 1);
				}
			})
		},
		
		addToRemoveArray:function(item){
			this.itemsToRemoveArray.push(item);
		},
		
		removeItemsInArray:function(){
			var that = this;
			$(this.itemsToRemoveArray).each(function(i, item){
				that.removeItem(item);
			})
			
			this.itemsToRemoveArray = [];
		},
		
		removeItem:function(item){
			
			item.element.addClass("tobeDeleted")
			
			if(item.objType == "box"){
				this.removeBox(item);
				return false;
			}
			
			if(item.objType == "fieldItem"){
				this.removeFieldItem(item);
				return false;
			}
			
			if(item.objType == "unit"){
				item.element.removeClass("tobeDeleted")
				this.removeUnit(item);
				return false;
			}
			
			
			$(this.items).each(function(i, cItem){
				if(item === cItem){
					item.map.items.splice(i, 1);
				}
			})
		},
		
		removeBox:function(box){
			$(this.boxes).each(function(i, cBox){
				if(box === cBox){
					box.element.remove();
					box.map.boxes.splice(i, 1);
				}
			})
		},
		
		removeUnit:function(unit){
			$(this.units).each(function(i, cUnit){
				if(unit === cUnit){
					unit.element.remove();
					unit.map.units.splice(i, 1);
				}
			})
		},
		
		getZindex:function(position){
			
			var x = position[0];
			var y = position[1];
			
			var z = y * 100;
			
			z += (this.size[0] - x);
			
			return z
		},
		
		clear:function(){
			this.fieldItems = [];
			this.items = [];
			this.boxes = [];
			this.units = [];
			this.user = null;
			$("map fielditems *").remove();
			$("map items *").remove();
			$("map boxes *").remove();
			$("map units *").remove();
		},
		
		getFieldItem:function(data){
			//Get position cordinates
			var x = data[0];
			var y = data[1];
			
			//Define currentItem as false if it is inside of map
			var currentItem = (x < 0 || x > this.size[0]-1 || y < 0 || y > this.size[1]-1) ? {type:"edge"} : false;
			
			$(this.fieldItems).each(function(i, c){
				//if there is a collition, set currentItem to this item
				
				if(c.position[0] == x && c.position[1] == y){
					currentItem = c;
				}
			})
			
			return currentItem;
		},
		
		getField:function(data){
			
			//Get position cordinates
			var x = data[0];
			var y = data[1];
			
			//Define currentItem as false if it is inside of map
			var currentItem = (x < 0 || x > this.size[0]-1 || y < 0 || y > this.size[1]-1) ? {type:"edge"} : false;
			

			var linqitems = Enumerable.From(this.items);
		    var search = linqitems.Where(function (t) { return t.x == x && t.y == y});
		    
		    if(search.Any()){
		    	currentItem = search.Single();
		    }


    		//log(item)
			
			//Loop tru all elements in map and check if there is a collition
			/*$(this.items).each(function(i, c){
				//if there is a collition, set currentItem to this item
				
				if(c.position[0] == x && c.position[1] == y){
					currentItem = c;
				}
			})*/
			
			$(this.boxes).each(function(i, c){
				//if there is a collition, set currentItem to this item
				if(c.position[0] == x && c.position[1] == y){
					currentItem = c;
				}
			})
			
			
			$(this.fieldItems).each(function(i, c){
				//if there is a collition, set currentItem to this item
				
				if(c.position[0] == x && c.position[1] == y){
					currentItem = c;
				}
			})
			
			$/*(this.units).each(function(i, c){
				//if there is a collition, set currentItem to this item
				if(c.position[0] == x && c.position[1] == y){
					currentItem = c;
				}
			})*/
			
			return currentItem;
		},
		
		
		
		
		
		
		
		setUnit:function(data){
		
			//Update games step counter
			game.addStep()
			 
			//Get new position cordinates
			var x = data.position[0];
			var y = data.position[1];
			
			var unitZindex = data.unit.isUser ? this.getZindex([x,y])+10 : this.getZindex([x,y]);
			
			//Set new position cordinates
			data.unit.position = [x,y];
			data.unit.element.css("marginLeft", this.fieldSize *x).css("marginTop", this.fieldSize *y).css("zIndex", unitZindex + 2)
			
		},
		
		
		
		
		
		
		
		
		
		
		
		
		setBox:function(data){
		
			var that = this;
			
			//Set box.inTransition
			data.box.inTransition = true;
			setTimeout(function(){data.box.inTransition = false}, game.animationTime.box)
			 
			if(data.box.clear){
				var clearObj = data.box.clearObj;
				clearObj.clearBox = null;
				data.box.clear = false;
				clearObj.element.removeClass("clear").addClass("unclear");
				clearObj.clear = false;
				data.box.element.removeClass("clear");
				setTimeout(function(){clearObj.element.removeClass("unclear")}, game.animationTime.box)
			}
			 
			//Get new position cordinates
			var x = data.position[0];
			var y = data.position[1];
			
			
			
			
			//Check if there is a goalspot on this position
			var clear = this.isGoal([x,y]);
			
			if(clear){
				data.box.clear = true;
				data.box.clearObj = clear;
				data.box.element.addClass("clear");
				clear.element.addClass("clear");
				clear.clearBox = data.box;
				
				//Check if all boxes are cleared
				var allClear = true;
				
				$(this.boxes).each(function(i, box){
					if(!box.clear)
						allClear = false;
				})
				
				//if all boxes are clear, call game action
				if(allClear){
					game.stop()
					game.runOnClearFuncs();
				}
				
				
			}else{
				data.box.clear = false;
				data.box.clearObj = null;
				data.box.element.removeClass("clear");
			}
			
			
			
			//Set new position cordinates
			data.box.position = [x,y];
			data.box.element.css("marginLeft", that.fieldSize *x).css("marginTop", that.fieldSize *y).css("zIndex", that.getZindex([x,y]));
			
		},
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		isGoal:function(position){
			var x = position[0];
			var y = position[1];
			var r = false;
			
			$(this.fieldItems).each(function(i, c){
				//if there is a collition, set currentItem to this item
				
				if(c.position[0] == x && c.position[1] == y && c.isGoal){
					r = c;
				}
			})
			
			return r;
		},
		
		isValid:function(){
			var isValid = true;
			var errorMessage = "";
			var goalEnding = (this.boxes.length - this.fieldItems.length == 1) ? '' : '\'s';
			
			log(this.fieldItems.length - this.boxes.length)
			
			that = this;
			
			if(this.units.length == 0){
				errorMessage += "You need to add a user before you can save!<br/>"
			}
			
			if(this.boxes.length == 0){
				errorMessage += "There need to be at least one poo on the map!<br/>"
			}
			
			if(this.fieldItems.length == 0 && this.boxes.length == 1){
				errorMessage += "Where should that poo go? You need to add a goal for it!<br/>"
			}else if(this.fieldItems.length == 0 && this.boxes.length > 1){
				errorMessage += "Where should all that poo go? You need to add a goal for each poo!<br/>"
			}else if(this.fieldItems.length > 0 && this.boxes.length > 0 && this.fieldItems.length > this.boxes.length){
				errorMessage += "There is not enough poo's in your map. You need to add " + (this.fieldItems.length - this.boxes.length) + " more!<br/>"
			}else if(this.fieldItems.length > 0 && this.boxes.length > 0 && this.fieldItems.length < this.boxes.length){
				errorMessage += "There is too many poo's in your map. You need to add " + (this.boxes.length - this.fieldItems.length) + " more goal" + goalEnding + "!<br/>"
			}
			
			if(errorMessage != ""){
				isValid = {
					message:function(actionWord){
						return errorMessage.replace(/save/g, actionWord)
					},
					isError:true
				}
			}			
			
			return isValid;
		},

		renderWater:function(){

			//Define water items holder
			var waterItems = [];

			//Fill water items holder
			$(this.items).each(function(i, item){
				if(item.type.indexOf("water") != -1){
					waterItems.push(item)
					
					if(!item.element.find("tl").exists()){
						item.element.append($("<tl>")).append($("<tm>")).append($("<tr>"));
						item.element.append($("<ml>")).append($("<mr>"));
						item.element.append($("<bl>")).append($("<bm>")).append($("<bbr>"));
					}
					
				}
			})


			//Go through all water items and find ref items that it touches
			$(waterItems).each(function(i, item){

				var x = item.position[0];
				var y = item.position[1];

				item.tl = false;
				item.tm = false;
				item.tr = false;

				item.ml = false;
				item.mr = false;

				item.bl = false;
				item.bm = false;
				item.br = false;

				$(waterItems).each(function(j, refItem){

					//TL
					if(refItem.position[0] == x-1 && refItem.position[1] == y-1){
						item.tl = refItem;
					}

					//TM
					if(refItem.position[0] == x && refItem.position[1] == y-1){
						item.tm = refItem;
					}

					//TR
					if(refItem.position[0] == x+1 && refItem.position[1] == y-1){
						item.tr = refItem;
					}


					//ML
					if(refItem.position[0] == x-1 && refItem.position[1] == y){
						item.ml = refItem;
					}

					//MR
					if(refItem.position[0] == x+1 && refItem.position[1] == y){
						item.mr = refItem;
					}


					//BL
					if(refItem.position[0] == x-1 && refItem.position[1] == y+1){
						item.bl = refItem;
					}

					//BM
					if(refItem.position[0] == x && refItem.position[1] == y+1){
						item.bm = refItem;
					}

					//BR
					if(refItem.position[0] == x+1 && refItem.position[1] == y+1){
						item.br = refItem;
					}
				})

				//check if item is full covered at all sides
				//log([item.element, item.tl, item.tm, item.tr, item.ml, item.mr, item.bl, item.bm, item.br])

				//Clear item from old classes
				item.element.removeClass("tl tm tr ml mr bl bm br bl-corner fullSea");

				if(	
					   item.tl 
					&& item.tm
					&& item.tr
					&& item.ml
					&& item.mr
					&& item.bl
					&& item.bm
					&& item.br
					){
					//log(item)
					item.element.addClass("fullSea");

				} else{

					if(!item.bm){
						item.element.addClass("bm")
					}

					if(!item.tm){
						item.element.addClass("tm")
					}

					if(item.tr != false && item.tm == false){
						item.element.addClass("tr")
					}

					if(item.tl != false && item.tm == false){
						item.element.addClass("tl")
					}

					if(item.mr != false && item.bm != false && item.br == false){
						item.element.addClass("br")
					}

					//if(item.ml != false && item.bm != false && item.bl == false){
					//	item.element.addClass("bl")
					//}

					if(item.br != false && item.bm == false){
						item.element.addClass("bl")
					}

					if(item.bl !== false && item.ml == false){
						item.element.addClass("bl-corner")
					}
				}

			})
		},
		
		export:function(){
			
			//Define return object
			var r = {
				size: this.size,
				type: this.type,
				items:[],
				fieldItems:[],
				boxes:[],
				units:[]
			}
			
			//Get all items
			$(this.items).each(function(i, item){
				r.items.push({
					position:		item.position,
					type:			item.type,
					//state:			item.state,
				})
			});
			
			//Get all items
			$(this.fieldItems).each(function(i, item){
				r.fieldItems.push({
					position:		item.position,
					type:			item.type,
					//state:			item.state,
				})
			});
			
			//Get all boxes
			$(this.boxes).each(function(i, box){
				r.boxes.push({
					position:		box.position,
					type:			box.type,
					//locked:			box.locked
				})
			});
			
			//Get all units
			$(this.units).each(function(i, unit){
				r.units.push({
					position:		unit.position,
					type:			unit.type,
					isUser:			unit.isUser ? unit.isUser : false,
				})
			});
			
			//Return returnItem
			return  JSON.stringify(r);
			//return r;
		}
	}
	
	return r.build();
}


//$.parseJSON(data.d)















































