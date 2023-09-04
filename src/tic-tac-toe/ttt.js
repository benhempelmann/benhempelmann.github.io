import { useState } from 'react';
// import './ttt.css';

export default function TicTacToe(){

    const [board, setBoard] = useState([]);


    return(
        <div id="game-board">
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        </div>
    )
}