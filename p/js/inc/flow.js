///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FLOW  //////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function flow(screens){
	
	var r; 
	
	//Go tru all screens
	$(screens).each(function(i, scr){
		
		if(scr.content){
			scr.content.next = function(parsed){
				r.goto({num:++r.curScreenNumber, parsed:parsed});
			}
		}
	})
	
	
	
	
	
	
	r = {
		curScreenNumber: 		0,
		screens:				screens,
		
		goto:function(data){
			
			var num = data.num;
			this.curScreenNumber = num;
			
			this.screens[num].parsed = "TEESST";
			
			var scr = this.screens[num].screen;
			var content = this.screens[num].content;
			
			if(!content){
				content = {};
			}
			
			content.parsed = data.parsed
			
			scr(content);
		}
	}
	
	
	r.goto({num:0})
	
	
	return r;
}









































