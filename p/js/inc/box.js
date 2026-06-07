///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BOX ////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function boxObject(data){
	
	var type 			= data.type ? data.type : "box";
	var position 		= data.position ? data.position : [0,0];
	var trail 			= [];
	var removed 		= data.removed ? data.removed : false;
	var locked 			= data.locked ? data.locked : false;
	var inTransition 	= false;
	var clear 			= data.clear ? data.clear : false;
	var endPosition 	= data.endPosition ? data.endPosition : [0,0]
	var map 			= data.map ? data.map : null;
	var objType 		= data.objType ? data.objType : "box"
	
	return {
		type:			type,				//Box
		position:		position,			//position of box on map
		trail:			trail,				//trail of all positions
		removed:		removed,			//if box is removed from map, this is true
		locked:			locked,				//if box is unmovable, this is true
		inTransition:	inTransition,		//if box is being moved/animated, this is true
		clear:			clear,				//If box is moved into correct place, this should be true
		endPosition:	endPosition,		//Position box needs to be moved at to be cleared
		map:			map,
		objType:		objType,
		
		//Move box to new position on map
		moveTo:function(data){
		
		},
		
		remove:function(){
			this.map.removeBox(this);
		}
	}
}
