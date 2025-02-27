import "./dialog.css";

function Dialog({ open, onClose }: { open: boolean, onClose: () => void }) {

  return <>
    <div className="overlay">
      <dialog className="dialog" open={open}>
        <h1>Well Done! 👏</h1>
        <div>
          <button className="btn btn-easy" onClick={onClose}>Home</button>
        </div>
      </dialog>
    </div>
  </>
}

export default Dialog;