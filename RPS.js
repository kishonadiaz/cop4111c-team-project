
//RPS.js
//javascript file that controls game logic for browser-based rock paper scissor game
//feel free to take any functions or build upon any of this stuff for our project
//don't be scared of the "const functionName = (parameters) => {function code here}" format

//to do list - feel free to erase this as they are completed
//save and resume later (could be done with cookies i guess?)
//leaderboard (seeing as we don't have a database... cookies also?)
//instructions (this should be easy enough, just a div or whatever element, maybe <aside>, with text that is styled in a fitting way)

//our 'database' json object that keeps score - note that this will reset on refresh
var score = {
    'wins':0,
    'ties':0,
    'losses':0
}

var saveandquit = document.getElementById("saveandquit");
//kishon Diaz 
//Gets URLParameters and outputs an object containing those parameters  
function getUrlParams(){
    let url = window.location.href;
    let paramString = url.split('?')[1];
    let paramarr = paramString.split('&');
    let out = {};
    for(let i =0; i < paramarr.length;i++){
        let output = paramarr[i].split('=');
        console.log(output);
        var name = output[0];
        out[name] = output[1].replace("%20","_");
    }

    return out;

}

//Kishon Diaz
//Formats Date to mm/dd/yyyy and outputs a string date
function formatDate(){
    var date = new Date();
    var day = date.getDate()
    var month = (date.getMonth()+1);
    var year = date.getFullYear();
    return `${month}/${day}/${year}`;
}
//gets the URL Params and passes into getload
let getload = getUrlParams();
//checks if it is a new game or a resumed game and either creates a new localStorage
//or gets a local storage
let playerdata;
let isnewgame = false;
if(getload["game"] == "new"){
    playerdata = JSON.parse(localStorage.getItem(getload["name"]));
    
    if(playerdata == null || playerdata == undefined){
        playerdata = {name:getload["name"],"wins":0,"losses":0,"ties":0,"date":formatDate()};
        console.log(playerdata);
        localStorage.setItem(getload["name"],JSON.stringify(playerdata));
        isnewgame = true;
    }else{
        score.wins = playerdata["wins"];
        score.losses = playerdata["losses"];
        screen.ties = playerdata["ties"];
    }
}else{
    playerdata = JSON.parse(localStorage.getItem(getload["name"]));
    console.log(playerdata);
    isnewgame = false;
    // for(var [i,item] of Object.entries(localStorage)){
    //     console.log(JSON.parse(item),);
    // }
}




//Adestin Grant
//function that resets W-L-T scores
const resetScore = () =>{
    //decalring some variables to be used in future functions - this can be placed elsewhere
    //it cant be placed in setCpuResult or rpsOnClick because that would reset the data after every click/game
    score.wins=0; score.ties=0;score.losses=0;
}

//Adestin Grant
//function that draws images of rock paper and scissors to the canvas API
const setImages = () =>{

    //grab elements from DOM

    var rock = document.getElementById("rockCanvas");
    var paper = document.getElementById('paperCanvas');
    var scissors = document.getElementById('scissorsCanvas');

    //get 2d contexts
    var rockCtx = rock.getContext("2d");
    var paperCtx = paper.getContext("2d");
    var scissorsCtx = scissors.getContext("2d")

    //declare and assign images
    var rockImg = new Image()
    rockImg.src = 'rock.png'

    var paperImg = new Image()
    paperImg.src = 'paper.png'

    var scissorsImg = new Image()
    scissorsImg.src = 'scissor.png'

    //draw previously declared images on image load
    rockImg.onload = function (){

        rockCtx.drawImage(rockImg, 0, 0, 250, 250);

    }

    scissorsImg.onload = function (){

        scissorsCtx.drawImage(scissorsImg, 0, 0, 250, 250);

    }

    paperImg.onload = function (){

        paperCtx.drawImage(paperImg, 0, 0, 250, 250);

    }

}


//Adestin Grant
//function that rewrites scoreboard taking into account them most recent result
const updateScore = (winCount, lossCount, tieCount) => {

    //grab applicable element, and get 2d context
    var scoreboard = document.getElementById("scoreboardCanvas");
    var scoreboardCtx = scoreboard.getContext("2d");
    
    //create replacement string
    let score = "W:"+String(winCount)+"-L:"+String(lossCount)+"-T:"+String(tieCount);

    //clear applicable canvas, set attributes, and fill text
    scoreboardCtx.clearRect(0, 0, scoreboard.width, scoreboard.height);
    scoreboardCtx.font = '48px Monospace';
    scoreboardCtx.fillStyle = 'black';
    scoreboardCtx.textAlign = 'center';
    scoreboardCtx.fillText(score,scoreboard.width/2,scoreboard.height/2);

}

//Adestin Grant, Kishon
//function that rewrites cpu choice based on the RNG roll
const updateCpuChoice = (res, winner,gameend) =>{

    //grab applicable element, and get 2d context
    var cpuChoice = document.getElementById("cpuChoiceCanvas");
    var cpuChoiceCtx = cpuChoice.getContext("2d");

    //create replacement string
    let cpuChoiceStr = 'The opponent chose ' + res + '! ' + winner;
    if(gameend){
        cpuChoiceStr = "Game Over: "+winner;
    }
    //clear applicable canvas, set attributes, and fill text
    cpuChoiceCtx.clearRect(0, 0, cpuChoice.width, cpuChoice.height);
    cpuChoiceCtx.font = '36px Monospace';
    cpuChoiceCtx.fillStyle = 'black';
    cpuChoiceCtx.textAlign = 'center';
    cpuChoiceCtx.fillText(cpuChoiceStr,cpuChoice.width/2,cpuChoice.height/2);

}

//Adestin Grant
//generate rng result to determine cpu opponent selection
const setCpuResult = () =>{

    //result var declation
    let res;

    //generate fake-random number
    rng = Math.random()

    //debug print
    //console.log(rng)

    //set result value dependent on random result
    if (rng<=0.33){
        res = 'rock';
    }
    else if(rng>0.33 && rng<=0.66){
        res = 'paper';
    }
    else if(rng>0.66){
        res = 'scissors';
    }

    //return result
    return res

}

function gameEnd(){
    const endamount = 10;
    var gameended = false;
    
    if(score.wins == endamount || score.losses == endamount|| score.ties == endamount){
        gameended = true;
    }

    return gameended;
}

function whoWins(){
    if(score.ties > score.wins && score.losses < score.ties  ){
        return "Tied Game";
    }else{
        if(score.wins > score.losses){
            return "Player Won!";
        }else{
            return "Oppent won!";
        }
    }
}

//Adestin Grant
//On click function to be attached to relevant canvas html elements
//this can be optimized - if you all choose
const rpsOnClick = (obj) =>{
    console.log('you chose ' + obj)
    let winner = ''
    //get rng-based result to simulate opponent
    cpuResult = setCpuResult()

    //debug print
    console.log('cpu res var:' + cpuResult)
    
    var isgameend = gameEnd();

    

        //if rock is selected
        if (obj == 'rock'){

            if (cpuResult == 'rock') {
                score.ties += 1
                winner='It\'s a tie!'
            }
            else if (cpuResult == 'paper'){
                score.losses += 1
                winner='The opponent wins!'
            }
            else if (cpuResult == 'scissors'){
                score.wins += 1
                winner='You win!'
            }

        }

        //if paper is selected
        else if (obj == 'paper'){

            if (cpuResult == 'rock') {
                score.wins += 1
                winner='You win!'
            }
            else if (cpuResult == 'paper'){
                score.ties += 1
                winner='It\'s a tie!'
            }
            else if (cpuResult == 'scissors'){
                score.losses += 1
                winner='The opponent wins!'
            }

        }

        //if scissors is selected
        else if (obj == 'scissors'){

            if (cpuResult == 'rock') {
                score.losses += 1
                winner='The opponent wins!'
            }
            else if (cpuResult == 'paper'){
                score.wins += 1
                winner='You win!'
            }
            else if (cpuResult == 'scissors'){
                score.ties += 1
                winner='It\'s a tie!'
            }
            
        }
    


    //more debug prints :)
    //console.log('wins:' + score.wins)
    //console.log('ties:' + score.ties)
    //console.log('losses:' + score.wins)

    //update scoreboard
    updateScore(score.wins, score.losses, score.ties);
    updateCpuChoice(cpuResult, winner,isgameend);
}

var maxSpeed = {
    car: 300, 
    bike: 60, 
    motorbike: 200, 
    airplane: 1000,
    helicopter: 400, 
    rocket: 8 * 60 * 60
};

function startover(){
    window.location.href = "RSP.html?game=new&name="+getload["name"];
}

function quitandsave(){
    playerdata = {name:getload["name"],"wins":score.wins,"losses":score.losses,"ties":score.ties,"date":formatDate()};
    localStorage.setItem(getload["name"],JSON.stringify(playerdata));
    window.location.href = "index.html";
    
}




//'main'
if(isnewgame)
    resetScore();
else{
    score.wins = playerdata["wins"];
    score.losses = playerdata["losses"];
    score.ties = playerdata["ties"];
}
updateScore(score.wins, score.losses, score.ties);
setImages();
saveandquit.addEventListener("click",quitandsave);
