///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FACEBOOK  //////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var face = {
	
	isLoggedIn:false,
	userId: null,
	userName:null,
	token:null,
	appID:"525389767474461",
	
	checkStatus:function(){
		this.init(false)
	},

	user:function(data){
		
		//GET
		if(!data){
			var userJSON = $.parseJSON(localStorage.fbUser);
			return userJSON;
		}
		
		//SET
		if(data){
			localStorage.fbUser = JSON.stringify(data);
			return data;
		}
	},
	
	
	friends:function(data){
		
		//GET
		if(!data){
			var friendsJSON = $.parseJSON(localStorage.fbFriends);
			return friendsJSON;
		}
		
		//SET
		if(data){
			localStorage.fbFriends = JSON.stringify(Enumerable.From(data).OrderBy(function (x) { return x.name }).ToArray());
			return data;
		}
	},
	
	action:function(data){
		
		if(face.isLoggedIn){
			data.action();
		}else{
			screen.transition.fadeIn(function(){

				//Fade into facebook login
				screen.facebookLogin(data)

			})
		}

		if(face.isLoggedIn){
			this.init(func);
		}else{
			screen.transition.fadeIn(function(){
				screen.facebookLogin(func, backFunc)
			})
		}
	},
	
	
	login:function(data){

		FB.login(function(){
			face.init(data)
		}, {scope: 'publish_stream'});
		screen.transition.fadeOut();
	},

	logout:function(data){

		FB.logout(function(response) {
		  	face.isLoggedIn = false;
		  	face.user(null)
		  	face.userId = null;
		  	face.userName = null;
		  	face.token = null;
		});

		$("body").addClass("fbOut").removeClass("fbIn")
	},


	getLoginStatus:function(data){

		FB.api('/me',function(me){
			if(me.id){//User logged in

				if(data.in)
					data.in()

				face.init(false)

				//$("fblogout name").html("TEST")

			}else{//User not logged in or not authorized

				if(data.out)
					data.out()
			}
		})
	},


	
	
	init:function(func){
		
		if(face.isLoggedIn){
			if(typeof func == "function"){
				return func();
			}
			
			return false;
		}
		
		//log("Nu logger den ind")

		FB.api('/me',function(me){
			if(me.id){//User logged in

				face.gender = me.gender;
				face.firstName = me.first_name;
				//$("fblogout name").html(me.first_name)

				//log("-------------")
				$("body").addClass("fbIn").removeClass("fbOut")

				//log($("body").attr("class"))
				//log($("fblogout")[0])

				face.userId = me.id;
				face.userName = me.name;

				face.user(me)
				face.isLoggedIn = true;

				FB.api('/me/friends', {fields:'id, name'}, function(friendResponse){
					face.friends(friendResponse.data)
					
					//Run function when friends is added
					if(typeof func == "function"){
						return func();
					}
				})


				//Create user in database
		if(gameService.enabled()) {
				$.ajax(
	            {
	                type: "GET",
	                contentType: "application/json; charset=utf-8",
	                url: gameService.url("users.asmx/Create"),
	                data: { 
	                	userName: 		JSON.stringify(me.name),
	                	userId:  		JSON.stringify(me.id),
	                	userEmail:  	JSON.stringify(''),
	                	deviceId:  		JSON.stringify(device.uuid)
	                },
	                dataType: "jsonp",
	                success: function (savedata)
	                {
	                    var savejson = $.parseJSON(savedata.d);
	                    //console.log(savejson);
	                }
	            });
		} else {}


			}else{//User not logged in or not authorized
				//log("Vil ikke logge ind, damit")
				$("body").addClass("fbOut").removeClass("fbIn")

				if(func !== false){
					screen.transition.fadeIn(function(){
						screen.facebookLogin({
							backAction:screenOverview,
							action:func
						})
					})
				}
			}
		})
	}
}
































