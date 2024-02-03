import {Link} from 'react-router-dom';
export default function NavBar(){
    return(
        <div className="flex flex-row">
            <Link to='/' className='mr-2'>Home</Link>
            <Link to='/game-of-life' className='mr-2'>Game of Life</Link>
            <Link to='Tic-Tac-Toe' className='mr-2'>Tic-Tac-Toe</Link>
            <Link to='/wordle' className='mr-2'>Wordle</Link>
            <Link className='mr-2'>Thing4</Link>
        </div>
    )    
}