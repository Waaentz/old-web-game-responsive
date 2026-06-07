///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO CONTROLLER ////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var audio = {
	
	element:false,
	
	build:function(musicfile){
		log("build")
		/*musicfile = musicfile ? musicfile : "preview";
		this.element = $("<audio style='position:absolute; top:-10000px' controls='controls' loop='loop' id='backgroundMusic'><source src='audio/" + musicfile + ".mp3' type='audio/mpeg' /></audio>");
		$("body").append(this.element)*/
	},
	
	play:function(){
		log("play")
		/*if(!this.element)this.build();
		this.element[0].play();
		this.isPlaying = true;*/
	},
	
	pause:function(){
		log("pause")
		/*this.element[0].pause();
		this.isPlaying = false;*/
	}
}





var audioFile = function(source){

	var audioElm = $("<audio style='position:absolute; top:-10000px' loop='loop' controls='controls'><source src='audio/" + source + ".mp3' type='audio/mpeg' /></audio>");
	
	$("body").append(audioElm)

	var r = {
		source:source,
		isPlaying:false,

		play:function(){
			

			if(localStorage.music == undefined || localStorage.music == "true"){
				audioElm[0].play();
			}
			this.isPlaying = true;
		},
		pause:function(){
			audioElm[0].pause();
			this.isPlaying = false;
		}
	}

	return r;
}


var audioFileInGame = function(source){

	/*var audioElm = $("<audio style='position:absolute; top:-10000px'  controls='controls'><source src='audio/" + source + ".mp3' type='audio/mpeg' /></audio>");
	
	audioElm[0].addEventListener('ended', function(){
		this.isPlaying = false;
	}, false);


	$("body").append(audioElm)*/

	var r = {
		source:source,
		isPlaying:false,

		play:function(){
			/*

			if(localStorage.music == undefined || localStorage.music == "true"){
				audioElm[0].play();
			}
			this.isPlaying = true;*/
		},
		pause:function(){
			/*audioElm[0].pause();
			this.isPlaying = false;*/
		},
		stop:function(){
			/*audioElm[0].pause();
			audioElm[0].currentTime = 0;
			this.isPlaying = false;*/
		}
	}

	return r;
}











