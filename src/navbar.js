import { Link } from 'react-router-dom';
import Dropdown from './dropdown';

const NavBar = () => {
  const gameItems = [
    { to: '/game-of-life', label: 'Game of Life' },
    { to: '/tic-tac-toe', label: 'Tic-Tac-Toe' },
    { to: '/wordle', label: 'Wordle' },
    { to: '/fractal', label: 'Fractal' },
  ];
  const graphicsItems = [
    { to: '/fractal', label: 'Fractal' },
  ]

  const handleClick = () => {
    // Handle click logic if needed
  };

  return (
    <nav className="flex bg-gray-200 h-[5vh]">
      <div className="flex flex-row items-center">
        <Link to="/" className="text-gray-800 font-semibold text-lg pl-5">
          Gengiben
        </Link>
        <Dropdown items={gameItems} onClick={handleClick} title="Games"/>
        <Dropdown items={graphicsItems} onClick={handleClick} title="Graphics"/>
      </div>
    </nav>
  );
};

export default NavBar;
