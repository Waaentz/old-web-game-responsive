///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FIELD ITEM /////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fieldItemObject(data){
	
	if(data.type == "goal-1"){data.isGoal = true}
	
	
	var type 			= data.type ? data.type : "goal";
	var position 		= data.position ? data.position : [0,0];
	var map 			= data.map ? data.map : null;
	var objType 		= data.objType ? data.objType : "fieldItem";
	var isGoal			= data.isGoal ? data.isGoal : false;
	
	var r = {
		type:			type,			
		position:		position,		
		walkOver:		true,
		map:			map,
		objType:		objType,
		isGoal:			isGoal,
		
		remove:function(){
			this.map.removeFieldItem(this);
		}
	}
	
	return r;
}