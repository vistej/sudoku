import { DEFAULT_VALUES, DIFFICULTY } from './constants';
import { Cell } from './model';

const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);
const getCommonValues = (
  seta: Set<string>,
  setb: Set<string>,
  setc: Set<string>
) => {
  const intersection = new Set(
    [...seta].filter((el) => setb.has(el) && setc.has(el))
  );
  return intersection;
};

export const generateData = (difficulty = DIFFICULTY.EASY) => {
  const rows = new Map();
  const cols = new Map();
  const squares = new Map();
  for (let i = 0; i < 9; i++) {
    rows.set(i, new Set(Array.from(DEFAULT_VALUES)));
    cols.set(i, new Set(Array.from(DEFAULT_VALUES)));
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const key = `${i}-${j}`;
      squares.set(key, new Set(Array.from(DEFAULT_VALUES)));
    }
  }

  const points = [];
  const grid: Cell[][] = [];
  for (let i = 0; i < 9; i++) {
    const line = [];
    for (let j = 0; j < 9; j++) {
      const key = `${i}-${j}`;
      points.push(key);
      const obj: Cell = {
        position: key,
        value: null,
        default: false,
        error: false,
      };
      line.push(obj);
    }
    grid.push(line);
  }

  const solve = (i: number, j: number): boolean => {
    if (i === 9) return true;
    if (j === 9) return solve(i + 1, 0);

    const square_index = `${Math.floor(i / 3)}-${Math.floor(j / 3)}`;
    const row = rows.get(i)!;
    const col = cols.get(j)!;
    const square = squares.get(square_index)!;

    let commonValues = Array.from(getCommonValues(row, col, square));
    commonValues = shuffleArray(commonValues);
    for (const val of commonValues) {
      grid[i][j].value = val;
      row.delete(val);
      col.delete(val);
      square.delete(val);

      if (solve(i, j + 1)) return true;

      row.add(val);
      col.add(val);
      square.add(val);
      grid[i][j].value = '';
    }

    return false;
  };

  solve(0, 0);
  const setVals = pickRandom(points, difficulty);
  const newGrid = [];
  for (let i = 0; i < 9; i++) {
    const newLine = [];
    for (let j = 0; j < 9; j++) {
      const obj = { ...grid[i][j] };
      if (!setVals.has(obj.position)) {
        obj.value = '';
      } else {
        obj.default = true;
      }
      newLine.push(obj);
    }
    newGrid.push(newLine);
  }
  return newGrid;
};

const pickRandom = (points: string[], difficulty = DIFFICULTY.EASY) => {
  let limit = 79;
  if (difficulty === DIFFICULTY.MEDIUM) limit = 30;
  if (difficulty === DIFFICULTY.HARD) limit = 25;
  const res = new Set();

  while (res.size < limit) {
    const ri = Math.floor(Math.random() * 81);
    res.add(points[ri]);
  }
  return res;
};

export const checkValidity = (grid: Cell[][]): [Cell[][], boolean] => {
  const newGrid = [...grid];
  const rows = new Map();
  const cols = new Map();
  const squares = new Map();
  let count = 0;
  let hasErrors = false;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j].value) {
        count++;
        const key = `${Math.floor(i / 3)}-${Math.floor(j / 3)}`;
        if (!rows.has(i)) rows.set(i, new Map());
        if (!cols.has(j)) cols.set(j, new Map());
        if (!squares.has(key)) squares.set(key, new Map());
        const row = rows.get(i);
        const col = cols.get(j);
        const square = squares.get(key);
        const obj = newGrid[i][j];

        if (row.has(obj.value) || col.has(obj.value) || square.has(obj.value)) {
          const [x, y] =
            row.get(obj.value) || col.get(obj.value) || square.get(obj.value);
          const prevObj = newGrid[x][y];
          if (!prevObj.default) prevObj.error = true;
          if (!obj.default) obj.error = true;
          hasErrors = true;
        } else {
          obj.error = false;
        }

        row.set(obj.value, [i, j]);
        col.set(obj.value, [i, j]);
        square.set(obj.value, [i, j]);

        rows.set(i, row);
        cols.set(j, col);
        squares.set(key, square);
      }
    }
  }
  return [newGrid, count === 81 && !hasErrors];
};
