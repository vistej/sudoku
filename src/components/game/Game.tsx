import { useEffect, useRef, useState } from "react";
import { Cell, GameStats, Stat } from "../../model";
import { NAV_KEYS, DEFAULT_VALUES, GAME_STATS } from "../../constants";
import { checkValidity, getUserStats } from "../../helper";
import InfoBar from "../infoBar/InfoBar";
import "./Game.css";

interface GameProps {
  grid: Cell[][];
  level: string | null;
  setGrid: (x: Cell[][]) => void;
  setSuccess: (x: boolean) => void;
  reset: () => void;
}
const Game = ({ grid, level, setGrid, setSuccess, reset }: GameProps) => {
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const boxRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [startTime] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setElapsedTime(startTime ? now - startTime : null);
    }, 1000);
    if (startTime === null && interval) clearInterval(interval)

    return () => clearInterval(interval);
  }, [startTime])

  const getBoxClassName = (obj: Cell) => {
    const className = ['input-box'];
    if (obj.default) className.push('blocked');
    else {
      if (obj.error) className.push('error');
      else className.push('user-box')
    }
    if (obj.value && obj.value === currentValue) className.push('same')
    return className.join(' ');
  }

  const onKeyChange = (i: number, j: number, e: React.KeyboardEvent<HTMLDivElement>, obj: Cell) => {
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

  const updateGrid = (i: number, j: number, val: string | null) => {
    const newGrid = [...grid];
    newGrid[i][j].value = val;
    setCurrentValue(val)
    const [checkedGrid, complete] = checkValidity(newGrid);
    setGrid(checkedGrid);
    if (complete) {
      if (level) {
        const gameStats = getUserStats();
        const obj: Stat = {
          date: new Date().toLocaleDateString(),
          difficulty: level,
          duration: elapsedTime || 0
        }
        gameStats[level].push(obj);
        localStorage.setItem(GAME_STATS, JSON.stringify(gameStats))
      }
      setSuccess(true);
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
    setCurrentValue(value);
  };

  const onExit = () => {
    setCurrentValue(null);
    setElapsedTime(null);
    reset();
  }

  return <>
    <InfoBar elapsedTime={elapsedTime} level={level} exit={onExit} />
    <div>
      {grid.map((row, i) => (
        <div className='box-row' key={i}>
          {row.map((obj, j) => (
            <div
              tabIndex={Number(`${i}${j}`)}
              key={j}
              className={getBoxClassName(obj)}
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
      ))}
    </div>
  </>
}

export default Game;