import { useEffect, useRef, useState } from "react";
import { Cell, NumCount, Stat } from "../../model";
import { NAV_KEYS, DEFAULT_VALUES, GAME_STATS, NUM_COUNTS } from "../../constants";
import { checkValidity, getUserStats } from "../../helper";
import InfoBar from "../infoBar/InfoBar";
import "./Game.css";
import NumPad from "../numPad/NumPad";

interface GameProps {
  grid: Cell[][];
  level: string | null;
  setGrid: (x: Cell[][]) => void;
  setSuccess: (x: boolean) => void;
  reset: () => void;
}
const Game = ({ grid, level, setGrid, setSuccess, reset }: GameProps) => {
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const boxRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [startTime] = useState(new Date().getTime());
  const [numCounts, setNumCounts] = useState<NumCount>(NUM_COUNTS);
  const [currentBox, setCurrentBox] = useState<string>('0-0');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setElapsedTime(startTime ? now - startTime : null);
    }, 1000);
    if (startTime === null && interval) clearInterval(interval)

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyChange);

    return () => window.removeEventListener('keydown', onKeyChange);
  })

  const getBoxClassName = (obj: Cell) => {
    const [i, j] = currentBox.split('-');
    const [x, y] = obj.position.split('-');
    const className = ['input-box'];
    if (obj.default) className.push('blocked');
    else {
      if (obj.position === currentBox) className.push('input-box-focus');
      if (obj.error) className.push('error');
      else className.push('user-box')
    }
    if (i === x || j === y) className.push('same-axis');
    const currentVal = boxRefs.current[currentBox]?.textContent;

    if (obj.value && obj.value === currentVal) className.push('same')
    return className.join(' ');
  }

  const onKeyChange = (e: KeyboardEvent) => {
    e.preventDefault();
    const [i, j] = currentBox.split('-').map(Number);
    if (Object.keys(NAV_KEYS).includes(e.key)) {
      navigate(i, j, e.key);
    } else {
      if (DEFAULT_VALUES.has(e.key)) {
        updateGrid(i, j, e.key);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        updateGrid(i, j, null)
      }
    }
  };

  const updateGrid = (i: number, j: number, val: string | null) => {
    if (grid[i][j].default) return;
    const newGrid = [...grid];
    newGrid[i][j].value = val;
    const [checkedGrid, complete, nc] = checkValidity(newGrid);
    setGrid(checkedGrid);
    setNumCounts(nc);
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
    let id = currentBox;
    switch (key) {
      case NAV_KEYS.ArrowUp:
        if (i > 0) {
          id = `${i - 1}-${j}`;
        }
        break;
      case NAV_KEYS.ArrowDown:
        if (i < grid.length - 1) {
          id = `${i + 1}-${j}`;
        }
        break;
      case NAV_KEYS.ArrowLeft:
        if (j > 0) {
          id = `${i}-${j - 1}`;
        }
        break;
      case NAV_KEYS.ArrowRight:
        if (j < grid[0].length - 1) {
          id = `${i}-${j + 1}`;
        }
        break;
      default:
        break;
    }
    setCurrentBox(id);
  };

  const updateFromNumpad = (num: string) => {
    const [x, y] = currentBox.split('-').map(Number);

    updateGrid(x, y, num);
  }

  const onExit = () => {
    setCurrentBox('');
    setElapsedTime(null);
    setNumCounts(NUM_COUNTS);
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
                  boxRefs.current[`${i}-${j}`] = el;
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                setCurrentBox(`${i}-${j}`);
              }}
            >
              {obj.value}
            </div>
          ))}
        </div>
      ))}
    </div>

    <NumPad numCounts={numCounts} onClick={(num: string) => updateFromNumpad(num)} />
  </>
}

export default Game;