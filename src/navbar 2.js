import { Link } from 'react-router-dom';
import Dropdown from './dropdown';

const NavBar = () => {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/game-of-life', label: 'Game of Life' },
    { to: '/tic-tac-toe', label: 'Tic-Tac-Toe' },
    { to: '/wordle', label: 'Wordle' },
  ];

  const handleClick = () => {
    // Handle click logic if needed
  };

  return (
    <nav className="bg-gray-200 p-4">
      <div className="flex flex-row items-center">
        <Link to="/" className="text-gray-800 font-semibold text-lg">
          Gengiben
        </Link>
        <Dropdown items={navItems.filter((item) => item.label !== 'Home')} onClick={handleClick} />
      </div>
    </nav>
  );
};

export default NavBar;
