///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITEM ///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function itemObject(data){
	
	var state 			= data.state ? data.state : "stable";
	var type 			= data.type ? data.type : "stone-1";
	var position 		= data.position ? data.position : [0,0];
	var trail 			= [];
	var removed 		= data.removed ? true : false;
	var map 			= data.map ? data.map : null;
	var objType 		= data.objType ? data.objType : "item"
	
	var r = {
		state:			state,			//stable, movable, moving, portal, door
		type:			type,			//all the difference types of items there is
		position:		position,		//position of item on map
		trail:			trail,			//trail of all positions
		removed:		removed,		//if item is removed from map, this is true
		map:			map,
		objType:		objType,
		
		//Move item to new position on map
		moveTo:function(data){
			
		},
		
		remove:function(){
			this.map.removeItem(this);
		}
	}
	
	return r;
}