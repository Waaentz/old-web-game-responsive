///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET ALL CLASSES ////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(!device) var device = {};
var is_chrome = true//navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var canvasTest = false;
var GAME_SERVICE_BASE_URL = window.GAME_SERVICE_BASE_URL || "";
var gameService = {
    url: function(path){
        if(!GAME_SERVICE_BASE_URL) return false;
        return (GAME_SERVICE_BASE_URL.replace(/\/$/, "") + "/webservices/" + String(path).replace(/^\//, ""));
    },
    enabled: function(){
        return !!GAME_SERVICE_BASE_URL;
    }
};



//clearLocalStorage();

loadCSS("style");
loadCSS("screens");
loadCSS("map/default");

load("//connect.facebook.net/en_US/all", true)
load("date");
load("linq");
load("preload");
load("shake");
load("jquery");
load("init");

load("item");
load("fieldItem");
load("level");
load("packs");
load("packs/firstjourney");
load("packs/theforrest");
load("packs/einstein");

load("box");

load("mobile");
load("helpers");
load("touch");
load("editor");
load("tracker");
load("challenges");
load("audio");
load("facebook");

if(canvasTest){
    load("ctx_game");
    load("ctx_unit");
    load("ctx_screen");
    load("ctx_map");
}else{
    load("map");
    load("unitcanvas");
    load("screen");
    load("game");
}


if(is_chrome){
    
    //Add data to the navigator object
    navigator.network = {connection:{type:"wifi",_firstRun:false,_timer:null,timeout:500}}

    //Run onload script now ehn cardova does not
    window.onload = function(){
        $(window).ready(function(){
            onDeviceReady();
        })
    }
}



function onDeviceReady(){
    
    //Add test data
    useTestData(is_chrome);
    
    //Add propper styling if device is old
    isDeviceOld();
    
    //Prepare all packs and levels
    packs.update();
    
    //Check if there is any new levels on the server
    packs.checkForServerUpdates();
    
    //Preload graphics
    preloadAllGraphics()
    
    //Start music script
    startMusic();
    
    //Start game 
    if(canvasTest){
        playGame(packs.get(1).getLevel(3))
    }else{
        screen.intro();
    }
}




//Run Cardova functions
function onBodyLoad(){      
    document.addEventListener("deviceready", function(){
        setTimeout(function(){
            onDeviceReady();
        }, 0)
    }, false);
}






















































function useTestData(data){
    if(data){
        face.isLoggedIn     = true;
        face.userId         = "707199590";
	    face.userName       = "Tobias Waaentz";
        
        $("body").addClass("test");
    }
}


function isDeviceOld(){
    //alert(navigator.userAgent)
    
    
    var testImage = new Image();
    testImage.src = "graphic/map-items/animation-sprite.png";
    
    $("body").addClass("old")
    device.isOld = true;
    
    testImage.onload = function(){
        $("body").removeClass("old")
        device.isOld = false;
    }
    
    
//    if(navigator.userAgent.match(/iPod/i)){
//        $("body").addClass("old")
//        device.isOld = true;
//    }
}



function startMusic(){
    menuMusic = audioFile("kids_video_game_07");
}



function canImg(source){
    var img = new Image();
    img.src = source;
    return img;
}

function createCanvas(canvasObj){
    
    var ctx = canvasObj[0].getContext("2d");

    var r = {
        display:function(img, x, y){
            if(!x)x=0;
            if(!y)y=0;

            canvasObj[0].width = canvasObj[0].width;
            ctx.drawImage(img, x, y);
        }
    }

    return r;
}

function clearLocalStorage(){
    localStorage.completed = "";
    localStorage.highscores = "";
    localStorage.isMaster = "";
}

function load(filename, ext){
	var path = (ext ? "" : "js/inc/") + filename + ".js?fileran=" + createUUID();
	var html = "<script type='text/javascript' src='" + path + "'></script>";
	document.write(html);
}


function loadCSS(filename){
	var path = "css/" + filename + ".css";
	var html = "<link rel='stylesheet' href='" + path + "' type='text/css' media='screen'>";
	document.write(html);
}


function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function preloadGraphic(images){
    
    $(images).each(function(i, url){
        var imageObj = new Image();
        imageObj.src = "graphic/" + url + ".png";
    })

}






function playGame(level){
    screen.clear()
    
    game.onClear(function(data){
        
        var oldScore = data.oldScore;
        var newScore = data.newScore;
        var isMaster = localStorage.isMaster;
        
        if(game.level.isLast){    
            
            if(game.level.pack.completed){
                screenLevelPacks({
                    justDone:"justDonePack" + game.level.pack.id
                });

                //Ask the user for a review after 3,5 secs
                setTimeout(function(){
                    askForReview();
                }, 3500)
                
            }else{
                screen.pack({
                    packId:game.level.pack.id,
                    backAction:screenLevelPacks
                })
            }
            
        }else { 
            //Else load next level
            var packId = game.level.pack.id;
            var nextLevel = game.level.nextLevel();

            screen.clear();
            game.clear();
            game.start(nextLevel);
        }
       
    })
    
    /*game.levels = levels.existingLevels;
    game.levelNum = levels.existingLevels.indexOf(level);
    game.mode = level.mode ? level.mode : null;
    game.challengeId = level.challengeId ? level.challengeId : null;*/
    game.start(level);
}



function playChallenge(challenge){
    screen.clear()
    game.isChallenge = challenge;
    game.start(challenge.level);
    
    game.onClear(function(){
        screen.challengeDone({
            challenge:challenge,
            steps:game.steps
        })
    })
}


function setChallengeCount(count){
console.log(count)
    var counterElm = $("<counter>").html(count);

    challenges.newCount = count;

    //Remove existing counter
    $("btn.editor counter").remove()


    if(parseInt(count) > 0){
        //log("@$%^$%^#$%^#$&#%&#$%^&$%^&")
        $("btn.editor").append(counterElm);
    }
}


function activateChallengeCount(){
    //Update challenge count
    if(challenges.newCount){
        setChallengeCount(challenges.newCount)
    }else{

        if(face.user()){
            challenges.update({
                userId:face.user().id,
                action:function(all){
                    
                    var chCount = 0;

                    $(all).each(function(i, ch){
                        if(!ch.ToUserHighscore && ch.FromUser.UserId != face.user().id){
                            chCount++
                        }
                    })

                    setChallengeCount(chCount)
                }
            })
        }
    }
}



function askForReview(){

    if(localStorage.alreadyRated == "yes")return false;

    navigator.notification.confirm(
        ' ★★★★★ \r We would love a 5 star review from you. Reviews is what makes our world go around!',  // message
        function(btn){
            if(btn === 1){
                localStorage.alreadyRated = "yes";
                window.open("itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=585343537&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software")
            }
        },
        'Do you like Poo Collector?',       // title
        'Rate now,Not now'                  // buttonLabels
    );

}

setTimeout(function(){
   // askForReview();
}, 1000)

function preloadAllGraphics(){
    preloadGraphic([

            "screens/overview/poonie-blink",
            "screens/overview/poonie-look-right",
            "screens/overview/poonie-look-left",
            "screens/overview/poonie-look-down",
            "screens/overview/poonie-look-up",
            "screens/overview/background",
            "screens/overview/background",
            "screens/overview/background",

            "screens/overview/background",
            "screens/overview/base",
            "screens/overview/deepwater",
            "screens/overview/grass1",
            "screens/overview/grass2",
            "screens/overview/grass3",
            "screens/overview/loading",
            "screens/overview/poo",
            "screens/overview/poonie",

            "screens/challenge-sent/background",
            "screens/challenge-sent/clouds",
            "screens/challenge-sent/header",
            "screens/challenge-sent/paperfly",

            "screens/challenges/background",
            "screens/challenges/challenge-item-draw",
            "screens/challenges/challenge-item-new-challenge",
            "screens/challenges/challenge-item-new",
            "screens/challenges/challenge-item",
            "screens/challenges/screen-draw",
            "screens/challenges/screen-winner",
            "screens/challenges/screen-looser",
            "screens/challenges/winner-blue",
            "screens/challenges/winner-red",
            "screens/challenges/winner",

            "screens/level-clear/background",

            "grass-base",

            "screens/finished/background",
            "screens/finished/background-highscore",
            "screens/finished/close",
            
            "screens/packs/background",
            "screens/packs/finished",
            "screens/packs/lock",
            "screens/packs/pack-easy",
            "screens/packs/pack-einstein",
            "screens/packs/pack-forrest",
            "screens/packs/screen-levels",
            "screens/packs/steps1",
            "screens/packs/steps2",

            "screens/level-clear/background",
            "screens/level-clear/dummy",
            "screens/level-clear/newhighscore",
            "screens/level-clear/nice",
            "screens/level-clear/poo",
            "screens/level-clear/poonie",

            "screens/levels/background",
            "screens/levels/back",
            "screens/levels/cleared",
            "screens/levels/poonie",
            "screens/levels/uncleared",

            "screens/universal/check",
            "screens/universal/facebook-icon",
            "screens/universal/facebook-login",
            "screens/universal/facebook-logout",
            "screens/universal/icon-sound-off",
            "screens/universal/icon-sound-on",
            "screens/universal/input",
            

            "map-items/animation-sprite",
            "map-items/goal-1",
            "map-items/flagpole",
            "map-items/flag",
            "map-items/flagpoleholder",
            "map-items/mushroom-1",
            "map-items/mushroom-2",
            "map-items/mushroom-3",
            "map-items/poo-1",
            "map-items/stone-1",
            "map-items/stone-2",
            "map-items/stone-3",
            "map-items/stone-4",
            "map-items/stone-5",
            "map-items/stone-6",
            "map-items/stone-7",
            "map-items/stone-8",
            "map-items/stone-9",
            "map-items/stone-10",
            "map-items/stone-11",
            "map-items/stone-12",
            "map-items/stone-13",
            "map-items/stone-14",
            "map-items/stone-15",
            "map-items/stone-16",
            "map-items/stone-17",
            "map-items/tree-1",
            "map-items/tree-2",
            "map-items/tree-3",
            "map-items/tree-4",
            "map-items/tree-5",
            "map-items/tree-6",
            "map-items/tree-7",
            "map-items/tree-8",
            "map-items/tree-9",
            "map-items/tree-10",
            "map-items/tree-chunks-1",
            "map-items/tree-chunks-2",
            "map-items/tree-chunks-3",
            "map-items/tree-chunks-4",
            "map-items/user",])
}


