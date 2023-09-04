import { useState, useEffect , useRef} from 'react';
import './ttt.css';

export default function TicTacToe(){
    const [player, setPlayer] = useState('X');
    const [board, setBoard] = useState([]);
    const numMoves = useRef(0);

    useEffect(()=>{
        if(board.length === 0){
            let newBoard = []
            for(let i=0;i<9;i++){
                newBoard.push({val:null})
            }
            setBoard(newBoard);
            numMoves.current = 0;
        }
    },[board])

    function checkResult(row, col){
        let checkEl = 3*row;
        if(board[checkEl].val === board[checkEl+1].val && board[checkEl].val === board[checkEl+2].val && board[checkEl].val !==null ){
            return true;
        }
        else if(board[col].val === board[col+3].val && board[col].val === board[col+6].val && board[col].val !==null ){
            return true;
        }
        else if((3*row + col)%4 === 0){
            if(board[0].val === board[4].val && board[0].val === board[8].val && board[0].val !==null ){
                return true;
            }
        }
        else if((3*row + col)%2 === 0){
            if(board[2].val === board[4].val && board[2].val === board[6].val && board[2].val !==null ){
                return true;
            }
        }
        else{
            return false;
        }
    }


    function handleClick(e){
        let row = parseInt(e.target.getAttribute('data-row'));
        let col = parseInt(e.target.getAttribute('data-col'));
        let idx = 3*row+col;
        if(board[idx].val !== null)
            return;
        
        let newBoard = [...board];
        
        newBoard[idx].val = player;
        setBoard(newBoard);
        numMoves.current ++;
        if(checkResult(row, col)){
            setTimeout(() => {
                if(alert('The ' + player + '\'s won!')){}
                else   setBoard([]); 
            }, 300)
            return
        }
        if(numMoves.current === 9){
            setTimeout(() => {
                if(alert('It\'s a Tie!')){}
                else   setBoard([]); 
            }, 300)
            return
        }
        if(player === 'X')
            setPlayer('O');
        else
            setPlayer('X');
    }

    return(
        <div className='flex flex-col text-center items-center'>
            <h1 className='text-5xl mb-6'>Tic-Tac-Toe</h1>
            <h2>It's {player}'s Turn</h2>
            <div className='h-[85vmin] w-[85vmin] grid grid-rows-3 grid-cols-3 border border-black'>
                {
                    board.map((cell, idx)=>{
                        return(
                            <div data-row={Math.floor(idx/3)} data-col={idx%3} key={idx}
                            onClick={handleClick}
                            className='flex items-center justify-center h-full w-full border border-black text-[30vmin]' >
                            {cell.val}</div>
                        )
                    })
                }
            </div>
        </div>
    )
}