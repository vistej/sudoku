import { DIFFICULTY } from '../../constants';
import './Home.css'

const Home = ({ createGame }: { createGame: (x: string) => void }) => {

  return <div className="wrapper">
    <div className="btn-box">
      <h2>New Game</h2>
      <button className="btn btn-easy" onClick={() => createGame(DIFFICULTY.EASY)}>Easy</button>
      <button className="btn btn-medium" onClick={() => createGame(DIFFICULTY.MEDIUM)}>Medium</button>
      <button className="btn btn-hard" onClick={() => createGame(DIFFICULTY.HARD)}>Hard</button>
    </div>
  </div>
}

export default Home;