import { useEffect, useState } from 'react';
import './Header.css';
import { THEME, THEMES } from '../../constants';
import { getTheme } from '../../helper';


const Header = () => {
  const [theme, setTheme] = useState<string>(getTheme());
  useEffect(() => {
    console.log(theme)
    if (theme === THEMES.Light) {
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
    }
  }, [theme])
  const toggleTheme = () => {
    const newTheme = theme === THEMES.Dark ? THEMES.Light : THEMES.Dark;
    setTheme(newTheme);
    localStorage.setItem(THEME, newTheme);
  }
  return <div className="header">
    <p className="title">Sudoku</p>
    <button className='theme' onClick={toggleTheme}>
      {theme === THEMES.Dark ? "☀️" : "🌙"}
    </button>
  </div>
}

export default Header;