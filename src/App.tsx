import { useState } from "react";
import { Cell } from "./model";
import './App.css'
import { generateData } from "./helper";
import Dialog from "./components/dialog/dialog";
import ReactConfetti from "react-confetti";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Game from "./components/game/Game";

function App() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  const createGame = (difficulty: string) => {
    const table = generateData(difficulty);
    setGrid(table);
    setLevel(difficulty);
  }

  const reset = () => {
    setGrid([]);
    setLevel(null);
    setSuccess(false);
  }



  return (
    <>
      <Header />
      <div className='container'>
        {grid.length ? <>
          <Game grid={grid} level={level} setGrid={setGrid} setSuccess={setSuccess} reset={reset} />
        </>
          : <Home createGame={createGame} />
        }
      </div>

      <Footer />
      {
        success && <>
          <ReactConfetti />
          <Dialog open={success} onClose={reset} />
        </>
      }

    </>
  )
}

export default App
