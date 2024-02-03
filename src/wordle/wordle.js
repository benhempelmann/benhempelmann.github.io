import { useEffect, useState, useRef} from 'react'
import {allWords, dictionary} from './words'
export default function Wordle(){
    const currWord = useRef(allWords[Math.floor(Math.random()*allWords.length)]);
    const typed = useRef('');
    const [board, _setBoard] = useState([]);
    const boardRef = useRef(board);
    function setBoard(newBoard){
        boardRef.current = newBoard;
        _setBoard(newBoard);
    }
    const currRow = useRef(0);

    const tRow = ['Q','W','E','R','T','Y','U','I','O','P'];
    const mRow = ['A','S','D','F','G','H','J','K','L'];
    const bRow = ['ENT','Z','X','C','V','B','N','M','DEL'];
    const keyStyle = 'border p-[3vmin] rounded cursor-pointer';


    useEffect(()=>{
        document.addEventListener('keydown', handleKeyPress);

        let newBoard = [];
        for(let i=0;i<30;i++){
            newBoard.push({
                letter: '',
                color: 'white',
            })
        }
        setBoard(newBoard)
        console.log(currWord.current);
    }, [])

    function checkWinner(word){
        if(dictionary.includes(word.toLowerCase())){
            let newBoard = [...boardRef.current];
            let letterCounts = {};
            for(let letter of currWord.current){
                if(letterCounts[letter] !== undefined)letterCounts[letter] += 1;
                else letterCounts[letter] = 1;
            }
            for(let i=0;i<5;i++){
                let newColor;
                if(word[i] === currWord.current[i]){
                    newColor = 'bg-green-500';
                    letterCounts[word[i]]--;
                }
                else if(currWord.current.includes(word[i]) && letterCounts[word[i]] > 0){
                    newColor = 'bg-yellow-500';
                    letterCounts[word[i]]--;
                }
                else{
                    newColor = 'bg-gray-300';
                }
                newBoard[5*currRow.current + i].color = newColor;
            }
            setBoard(newBoard);
            typed.current = '';
            currRow.current++;
            if(currRow.current === 6){
                setTimeout(() => {
                    if(alert('You Lost')){}
                        else    window.location.reload(); 
                }, "300")
            }
            if(word.toLowerCase() === currWord.current){
                setTimeout(() => {
                    if(alert('Congradulations, you won!')){}
                        else    window.location.reload(); 
                }, "300")
            }
        }
    }


    function handleClick(e){
        const val = e.target.getAttribute('data-val');
        let typedStr = typed.current;
        if(val === 'ENT'){ //enter pressed
            if(typedStr.length === 5){
                checkWinner(typedStr.toLowerCase());
                return;
            }
        }
        else if(val === 'DEL'){
            typedStr = typedStr.substring(0,Math.max(typedStr.length-1, 0));
        }
        else{
            typedStr += val;
        }
        if(typedStr.length === 6) return;
        let newBoard = [...boardRef.current];
        for(let i=0;i<5;i++){
            newBoard[5*currRow.current + i].letter = i<typedStr.length ? typedStr[i] : '';
        }
        setBoard(newBoard);
        typed.current = typedStr;
    }

    function handleKeyPress(e){
        let typedStr = typed.current;
        if(e.keyCode === 13){ //enter pressed
            if(typedStr.length === 5){
                checkWinner(typedStr.toLowerCase());
            }
        }
        else if(e.keyCode === 8){
            typedStr = typedStr.substring(0,Math.max(typedStr.length-1, 0));
        }
        if(typedStr.length === 5) return;
        else if(e.keyCode >= 65 && e.keyCode <= 90){
            typedStr += e.key.toUpperCase()
        }
        let newBoard = [...boardRef.current];
        for(let i=0;i<5;i++){
            newBoard[5*currRow.current + i].letter = i<typedStr.length ? typedStr[i] : '';
        }
        setBoard(newBoard);
        typed.current = typedStr;
    }

    function renderBoard(){
        return(
            <div className='grid grid-cols-5 grid-rows-6 w-full max-w-[45vh] mb-5 h-[50%] border border-black rounded-lg'>
                {boardRef.current.map((cell,idx)=>{
                    return(
                        <div key={`cell${idx}`} className={`flex ${cell.color} border border-black rounded w-full h-[8vh] text-[8vmin] justify-center items-center`}>
                            {cell.letter}
                        </div>
                    )
                })}
            </div>
        )
    }

    function renderKeyBoard(){
        const control = {onClick: handleClick};
        return (
            <div className='h-full flex flex-col items-center'>
                <div className='flex flex-row'>
                    {tRow.map((letter)=>{
                        return(
                            <div className={keyStyle} key={letter} data-val={letter} {...control}>{letter}</div>
                        )
                     })}
                </div>
                <div className='flex flex-row'>
                    {mRow.map((letter)=>{
                        return(
                            <div className={keyStyle} key={letter} data-val={letter} {...control}>{letter}</div>
                        )
                     })}
                </div>
                <div className='flex flex-row'>
                    {bRow.map((letter)=>{
                        return(
                            <div className={keyStyle} key={letter} data-val={letter} {...control}>{letter}</div>
                        )
                     })}
                </div>
            </div>

        )
    }
    return(
        <div className='h-[97%] flex flex-col items-center'>
            <h1 className='text-5xl mb-4'>Wordle</h1>
            {renderBoard()}
            {renderKeyBoard()}
        </div>
    )
}