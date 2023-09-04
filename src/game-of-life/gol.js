import { useEffect, useState, useRef } from "react"
import './gol.css'
export default function GOL(){
    
    const [grid, setGrid] = useState([[]]);
    const [running, setRunning] = useState(false);
    const ROWS = useRef(Math.floor(window.innerHeight/20-7));
    const COLS = useRef(Math.floor(window.innerWidth/20-1));

    //initial set and resetting the grid
    useEffect(()=>{
        if(grid.length === 1){
            document.documentElement.style.setProperty("--num-rows", ROWS.current);
            document.documentElement.style.setProperty("--num-cols", COLS.current);
            let newArr = [];
            for(let i=0;i<ROWS.current;i++){
                let newRow = []
                for(let j=0;j<COLS.current;j++){
                    newRow.push({row: i, col: j, alive: false});
                }
                newArr.push(newRow);
            }
            setGrid(newArr);
        }
    },[grid])

    useEffect(()=>{
        if(running){
            let newGrid = JSON.parse(JSON.stringify(grid));
            for(let i=0;i<ROWS.current;i++){
                for(let j=0;j<COLS.current;j++){
                    //main game rules
                    let numAlive = checkNeighbors(i,j);
                    // console.log(numAlive)
                    if(grid[i][j].alive){
                        if(numAlive < 2 || numAlive > 3){
                            newGrid[i][j].alive = false;
                        }
                    }
                    else{
                        if(numAlive === 3){
                            newGrid[i][j].alive = true;
                        }
                    }
                }
            }
            setTimeout(()=>{
                setGrid(newGrid);
            },150)
        }
    },[grid, running])

    function checkNeighbors(row, col){
        let numAlive = 0;
        for(let i=row-1;i<row+2;i++){
            if(i<grid.length && i >= 0){
                for(let j=col-1;j<col+2;j++) {
                    if(j < grid[i].length && j >= 0){
                        if(!(i === row && j === col)){
                            if(grid[i][j].alive === true){
                                numAlive++;
                            }
                        }
                    }
    
                }
            }
        }
        return numAlive;
    }
    
    function cellClicked(e){
        let row = e.target.getAttribute("data-row");
        let col = e.target.getAttribute("data-col");
        let newGrid = [...grid];
        if(newGrid[row][col].alive){
            newGrid[row][col].alive = false;
            e.target.style.backgroundColor = 'white';
        }
        else{
            newGrid[row][col].alive = true;
            e.target.style.backgroundColor = 'black';
        }
        setGrid(newGrid);
    }

    return(
        <div className="flex flex-col text-center justify-items-center">
            <h1 className="text-3xl">Conways Game of Life</h1>
            <div className="flex justify-center mb-2/1.5 h-10">
                <button onClick={()=>setRunning(true)} 
                className="h-6bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Start</button>
                <button onClick={()=>setRunning(false)} 
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Stop</button>
                <button onClick={()=>{setGrid([[]]);setRunning(false)}} 
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Reset</button>
            </div>
            <div className="golGrid">
                {grid.map((row) => {
                    return (
                        row.map((cell, idx) =>{
                            return(
                                <div key={idx} onClick={cellClicked} data-row={cell.row} data-col={cell.col} style={{backgroundColor: cell.alive?"black": "white"}}
                                className="w-5 h-5 border border-black"
                                ></div>
                            )
                        })
                    )
                })}
            </div>
        </div>
    )
}


