//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATE OBJECT ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function d(data){
	
	var container = {
		
		full:		null,
		date:		null,
		day:		null,
		week:		null, 
		month:		null,
		year:		null,
		dayName:	null,
		dateObject:	null,
		
		set:function(data, successFunc){
			
			//Strip down data if its an date object (d object)
			if(typeof data == "object"){
				if(data.full != null){
					data = data.full
				}
			}
			
			//If nothing added, use todays date
			if(!data){
				var newDate = new Date();
				var day = newDate.getDate();
				var month = newDate.getMonth();
				var year = newDate.getFullYear();
				
				data = day + "/" + month + "/" + year;
			}
			
			//make sure date is in correct format
			data = data.replace("-", "/");
			
			//Avoid strange jQuery error by having the folling line
			//if(!data){data = serverData.date}
			
			//Set data object from date string
			var dateData 	= data.split("/");
			var dateObject 	= new Date(dateData[2],dateData[1]-1,dateData[0]);
			this.dateObject = dateObject;
			
			if(typeof dateObject.getMonth() != "number"){
				//If error
				err("Can't create date with " + dateObject.getMonth());
				return false
			}else {
				//if succes, save data to object
				this.date 			= dateObject.getDate();
				this.day			= dateObject.getDay();
				this.month			= dateObject.getMonth() + 1;
				this.year			= dateObject.getFullYear();
				this.full 			= this.date + "/" + this.month + "/" + this.year;
				
				if(successFunc)
					successFunc(this)
				
				return this;
			}
		},
		
		nextDay:function(c){
			if(!c)c=1;
			var newDate = new Date(this.dateObject.getTime() + (c * 86400000));
			return d(newDate.getDate() + "/" + parseInt(newDate.getMonth() + 1) + "/" + newDate.getFullYear());
		}, 
		
		prevDay:function(c){
			if(!c)c=1;
			return this.nextDay(-c);
		},
		
		nextWeek:function(c){
			if(!c)c=1;
			var newWeek = new Date(this.dateObject.getTime() + (c * 604800000));
			return d(newWeek.getDate() + "/" + parseInt(newWeek.getMonth() + 1) + "/" + newWeek.getFullYear());
		},
		
		prevWeek:function(c){
			if(!c)c=1;
			return this.nextWeek(-c);
		},
		
		nextMonth:function(c){
			if(!c)c=1;
			
			var cDate = new Date(this.dateObject);		//current date
			var nDate = new Date(this.dateObject);		//next date
			var nMax = new Date(nDate)					//max date in next month
			
			nMax.setDate(1)
			nMax.setMonth(nDate.getMonth() + 1)
			nMax.setMonth(0);
			
			nDate.setDate(cDate.getDate() > nMax.getDate() ? nMax.getDate() : cDate.getDate())
			
			return d(nDate.getDate() + "/" + parseInt(nDate.getMonth() + (c+1)) + "/" + nDate.getFullYear())
		},
		
		prevMonth:function(c){
			if(!c)c=1;
			return this.nextMonth(-c);
		},
		
		nextYear:function(c){
			if(!c)c=1;
			
			var nDate = new Date(this.dateObject);
			nDate.setYear(nDate.getFullYear() + c)
			
			return d(nDate.getDate() + "/" + parseInt(nDate.getMonth() + 1) + "/" + nDate.getFullYear())
		},
		
		prevYear:function(c){
			if(!c)c=1;
			return this.nextYear(-c);
		}	
	}
	return container.set(data);
}
