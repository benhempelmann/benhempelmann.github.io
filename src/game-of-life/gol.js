import { useEffect, useState } from "react"
export default function GOL(){
    const ROWS = Math.floor(window.innerHeight/20-7);
    const COLS = Math.floor(window.innerWidth/20-3);

    document.documentElement.style.setProperty("--num-rows", ROWS);
    document.documentElement.style.setProperty("--num-cols", COLS);
    const [grid, setGrid] = useState([[]]);
    const [running, setRunning] = useState(false);

    //initial set and resetting the grid
    useEffect(()=>{
        if(grid.length === 1){
            let newArr = [];
            for(let i=0;i<ROWS;i++){
                let newRow = []
                for(let j=0;j<COLS;j++){
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
            for(let i=0;i<ROWS;i++){
                for(let j=0;j<COLS;j++){
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
            },250)
        }
    },[grid, running])

    useEffect(()=>{
        // console.log("true");
    }, [running])

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
        <div className="gol">
            <h1>Conways Game of Life</h1>
            <div className="controls">
                <button onClick={()=>setRunning(true)}>Start</button>
                <button onClick={()=>setRunning(false)}>Stop</button>
                <button onClick={()=>{setGrid([[]]);setRunning(false)}}>Reset</button>
            </div>
            <div className="grid">
                {grid.map((row) => {
                    return (
                        row.map((cell, idx) =>{
                            return(
                                <div key={idx} onClick={cellClicked} className="cell" data-row={cell.row} data-col={cell.col} style={{backgroundColor: cell.alive?"black": "white"}}></div>
                            )
                        })
                    )
                })}
            </div>
        </div>
    )
}


