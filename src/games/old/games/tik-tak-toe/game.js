const gameBoard = document.getElementById("game-board");

let curr_player = 1;
let numTurns = 0;

let buttons = gameBoard.getElementsByTagName('div');

const buttonPressed = e => {
    let element = e.target;
    addChoice(element);
}
for (let button of buttons){
    button.addEventListener("click", buttonPressed);
    button.addEventListener("touchstart", buttonPressed);
}

function addChoice(element){
    let posx = Math.round(3*(element.offsetLeft)/gameBoard.offsetWidth);
    let posy = Math.round(3*(element.offsetTop)/gameBoard.offsetHeight);
    let pos = 3*posy +posx;
    if (element.innerHTML == ''){
        numTurns++;
        if (curr_player == 1){
            element.innerHTML = "X"; 
            curr_player = 2;
        }
        else{
            element.innerHTML = "O"; 
            curr_player = 1;
        }
        if(checkWinner(pos)){
            setTimeout(() => {
                if(alert('The ' + element.innerHTML + '\'s won!')){}
                else    window.location.reload(); 
            }, "300")
            
        }
        else if (numTurns == 9){
            setTimeout(() => {
                if(alert('It\'s a Tie!')){}
                else    window.location.reload(); 
            }, "300")
        }

    }
        
}

function checkWinner(pos){
    let boxes = gameBoard.getElementsByTagName('div');
    let newPosy = pos % 3;
    let newPosx = pos - newPosy;
    // console.log(newPosy);
    // console.log(newPosx);
    // console.log(pos)
    if(boxes[newPosy].innerHTML == boxes[newPosy+3].innerHTML && boxes[newPosy].innerHTML == boxes[newPosy+6].innerHTML){
        return true;
    }
    else if(boxes[newPosx].innerHTML == boxes[newPosx+1].innerHTML && boxes[newPosx].innerHTML == boxes[newPosx+2].innerHTML){
        return true;
    }
    else if(pos % 4 == 0){
        if(boxes[0].innerHTML == boxes[4].innerHTML && boxes[0].innerHTML == boxes[8].innerHTML){
            return true;
        }
    }
    else if (pos % 2 == 0){
        if(boxes[2].innerHTML == boxes[4].innerHTML && boxes[2].innerHTML == boxes[6].innerHTML){
            return true;
        }
    }
    else{
        return false;
    }
    
}



// window.onclick = e => {
//     const element = e.target
//     if (e.target.tagName == "DIV"){
//         let posx = Math.round(3*(element.offsetLeft)/gameBoard.offsetWidth);
//         let posy = Math.round(3*(element.offsetTop)/gameBoard.offsetHeight);
//         let pos = 3*posy +posx;
//         console.log(element.offsetTop);
//         if (element.innerHTML == ''){
//             numTurns++;
//             if (curr_player == 1){
//                 element.innerHTML = "X"; 
//                 curr_player = 2;
//             }
//             else{
//                 element.innerHTML = "O"; 
//                 curr_player = 1;
//             }
//             if(checkWinner(pos)){
//                 setTimeout(() => {
//                     if(alert('The ' + element.innerHTML + '\'s won!')){}
//                     else    window.location.reload(); 
//                   }, "300")
                
//             }
//             else if (numTurns == 9){
//                 setTimeout(() => {
//                     if(alert('It\'s a Tie!')){}
//                     else    window.location.reload(); 
//                   }, "300")
//             }

//         }
//     }
// }