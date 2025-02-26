import { useState } from "react";
import "./Stats.css";
import { GameStats } from "../../model";
import { DIFFICULTY } from "../../constants";
import { getUserStats } from "../../helper";

const Stats = () => {

  const [userStats] = useState<GameStats>(getUserStats());

  return <>
    {userStats && <>
      <h2>Statistics</h2>
      <div className="stats">
        <div className="stat stat-easy">
          <h3>Easy</h3>
          <p className="stat-value">{userStats[DIFFICULTY.EASY].length}</p>
        </div>
        <div className="stat stat-medium">
          <h3>Medium</h3>
          <p className="stat-value">{userStats[DIFFICULTY.MEDIUM].length}</p>
        </div>
        <div className="stat stat-hard">
          <h3>Hard</h3>
          <p className="stat-value">{userStats[DIFFICULTY.HARD].length}</p>
        </div>
      </div>
    </>}
  </>
}

export default Stats;