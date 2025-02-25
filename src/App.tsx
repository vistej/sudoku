import { useState, useRef, KeyboardEvent } from "react";
import { DEFAULT_VALUES, DIFFICULTY, NAV_KEYS } from "./constants";
import { Cell } from "./model";
import './App.css'
import { checkValidity, generateData } from "./data";
import Dialog from "./dialog";
import ConfettiExplosion from "react-confetti-explosion";

function App() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const boxRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [type, setType] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  const createGame = (difficulty: string) => {
    const table = generateData(difficulty);
    setGrid(table);
    setType(difficulty);
  }

  const updateGrid = (i: number, j: number, val: string | null) => {
    const newGrid = [...grid];
    newGrid[i][j].value = val;
    setCurrentValue(val)
    const [checkedGrid, complete] = checkValidity(newGrid);
    setGrid(checkedGrid);
    console.log(complete)
    if (complete) {
      setSuccess(true);
    }
  };

  const onKeyChange = (i: number, j: number, e: KeyboardEvent, obj: Cell) => {
    e.preventDefault();
    if (Object.keys(NAV_KEYS).includes(e.key)) {
      navigate(i, j, e.key);
    } else if (!obj.default) {
      if (DEFAULT_VALUES.has(e.key)) {
        updateGrid(i, j, e.key);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        updateGrid(i, j, null)
      }
    }
  };

  const navigate = (i: number, j: number, key: string) => {
    let id = '';
    let value = null;
    switch (key) {
      case NAV_KEYS.ArrowUp:
        if (i > 0) {
          id = `box-${i - 1}-${j}`;
          value = grid[i - 1][j].value;
        }
        break;
      case NAV_KEYS.ArrowDown:
        if (i < grid.length - 1) {
          id = `box-${i + 1}-${j}`;
          value = grid[i + 1][j].value;
        }
        break;
      case NAV_KEYS.ArrowLeft:
        if (j > 0) {
          id = `box-${i}-${j - 1}`;
          value = grid[i][j - 1].value;
        }
        break;
      case NAV_KEYS.ArrowRight:
        if (j < grid[0].length - 1) {
          id = `box-${i}-${j + 1}`;
          value = grid[i][j + 1].value;
        }
        break;
      default:
        break;
    }
    boxRefs.current[id].focus();
    console.log(value)
    setCurrentValue(value);
  };

  const reset = () => {
    if (type) {
      localStorage.setItem(type, ((Number(localStorage.getItem(type) || 0)) + 1).toString());
      setGrid([]);
      setType(null);
      setCurrentValue(null);
      setSuccess(false);
    }
  }

  return (
    <>
      <div className="header">
        <h1>Sudoku</h1>
      </div>
      <div className='container'>
        {grid.length ? grid.map((row, i) => (
          <div className='box-row' key={i}>
            {row.map((obj, j) => (
              <div
                tabIndex={Number(`${i}${j}`)}
                key={j}
                className={`input-box ${obj.default ? 'blocked' : ''} ${obj.value && obj.value === currentValue ? 'same' : ''} ${obj.error ? 'error' : ''}`}
                ref={(el) => {
                  if (el) {
                    boxRefs.current[`box-${i}-${j}`] = el;
                  }
                }}
                onKeyDown={(e) => onKeyChange(i, j, e, obj)}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentValue(obj.value)
                }}
              >
                {obj.value}
              </div>
            ))}
          </div>
        )) : <div className="wrapper"><div className="btn-box">
          <h2>New Game</h2>
          <button className="btn" onClick={() => createGame(DIFFICULTY.EASY)}>Easy</button>
          <button className="btn" onClick={() => createGame(DIFFICULTY.MEDIUM)}>Medium</button>
          <button className="btn" onClick={() => createGame(DIFFICULTY.HARD)}>Hard</button>
        </div>
        </div>
        }
      </div>
      {success && <>
        <Dialog open={true} onClose={reset} />
      </>}
      <ConfettiExplosion
        force={0.8}
        duration={3000}
        particleCount={250}
        width={1600}
      />
    </>
  )
}

export default App
