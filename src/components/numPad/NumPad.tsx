import { NumCount } from "../../model";
import "./NumPad.css";

const NumPad = ({ numCounts, onClick }: { numCounts: NumCount, onClick: (n: string) => void }) => {
  return <div className="numpad">
    {Object.keys(numCounts).map(num =>
      <p key={num} className={`numkey ${numCounts[num] >= 9 ? 'disabled' : 'active'}`} onClick={() => onClick(num)}>{num}</p>)}
  </div>
}

export default NumPad;