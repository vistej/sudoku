import { formatElapsedTime } from "../../data";
import "./InfoBar.css";

interface InfoBarProps {
  level: string | null;
  elapsedTime: number | null;
  exit: () => void;
}

const InfoBar = ({ level, elapsedTime, exit }: InfoBarProps) => {


  return <div className="info-bar">
    <p className={`level btn-${level?.toLowerCase()}`}>{level}</p>
    <p className="time">{formatElapsedTime(elapsedTime)}</p>
    <p className="close" onClick={exit}>Exit</p>
  </div>
}

export default InfoBar;