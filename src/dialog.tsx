
function Dialog({ open, onClose }: { open: boolean, onClose: () => void }) {

  return <>
    <div className="overlay">
      <dialog className="dialog" open={open}>
        <h1>Well Done!👏</h1>
        <div>
          <button className="btn" onClick={onClose}>OK</button>
        </div>
      </dialog>
    </div>
  </>
}

export default Dialog;