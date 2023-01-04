// TODO
//Make the display board sporate elements per row

import { allWords,dictionary } from "./words.js";
let CURR_ROW = 0;
let CURR_WORD = "";
let CURR_LETTER =0;
const randWord = allWords[Math.floor(Math.random()*allWords.length)]
window.onload=function(){
    console.log(randWord);
    setOutline();
    setKeyboard();
    keyboardListner();
}
//Creat the wordle spots
function setOutline(){
    const drows = document.getElementsByClassName("drow");
    let currRow = 0;
    for(let i=0;i<30;i++){
        const newElement = document.createElement("div");
        newElement.classList.add("box");
        if(i%5 == 0){
            currRow ++;
        }
        let idStr = (currRow-1);
        newElement.classList.add(idStr);
        drows[currRow-1].appendChild(newElement);
    }
}

//create the keyboard
function setKeyboard(){
    const keyVals = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','ENTER','Z','X','C','V','B','N','M','DELETE'];
    const rows = document.getElementsByClassName("row");
    for(let i=0;i<keyVals.length;i++){
        const newElement = document.createElement("button");
        const letter = document.createTextNode(keyVals[i]);
        newElement.style.padding = "3px";
        newElement.appendChild(letter);
        newElement.classList.add("key");
        newElement.addEventListener("click", buttonPressed);
        newElement.addEventListener("touchstart", buttonPressed);
        if (i<10){
            rows[0].appendChild(newElement);
        }
        else if(i<19){
            rows[1].appendChild(newElement);
        }
        else{
            rows[2].appendChild(newElement);
        }
        
    }
}

function gameLogic(btnContents){
    const elements = document.getElementsByClassName(CURR_ROW);
    if(btnContents == "ENTER"){
        if(CURR_LETTER == 5){
            if (dictionary.includes(CURR_WORD.toLowerCase())){
                updateColors(elements);
                if (CURR_WORD.toLowerCase() == randWord){
                    endGame();
                }
                else{
                    CURR_ROW ++;
                    CURR_LETTER = 0;
                    CURR_WORD = "";    
                }
                
            }
        }
    }
    else if (btnContents == "DELETE"){
        if(CURR_LETTER-1 >= 0){
            elements[CURR_LETTER-1].innerHTML = "";
            CURR_WORD = CURR_WORD.slice(0,CURR_WORD.length-1);
            CURR_LETTER--;
        }
    }
    else{
        if (CURR_LETTER < 5){
            CURR_WORD += btnContents;
            elements[CURR_LETTER].innerHTML = btnContents;
            CURR_LETTER ++;
        }
    }
}

function keyboardListner(){
    window.addEventListener('keyup', function(event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        if (event.keyCode >= 65 && event.keyCode <= 90){
            gameLogic(event.key.toUpperCase());
        }
        else if(event.keyCode == 8){
            gameLogic("DELETE");
        }
        else if(event.keyCode == 13){
            gameLogic("ENTER");
        }
        event.preventDefault();
    },true);
}

const buttonPressed = e => {
    const btnContents = e.target.innerHTML;
    gameLogic(btnContents);
}

function updateColors(elements){
    for(let i=0;i<CURR_WORD.length;i++){
        if(CURR_WORD[i].toLowerCase() == randWord[i]){
            //set color to green
            elements[i].style.backgroundColor = 'green';
        }
        else if (randWord.includes(CURR_WORD[i].toLowerCase())){
            //make yellow
            elements[i].style.backgroundColor = 'yellow';
        }
        else{
            elements[i].style.backgroundColor = 'gray';
        }
    }
}

function endGame(){
    setTimeout(() => {
    if(alert('Congradulations, you won!')){}
        else    window.location.reload(); 
    }, "300")
}