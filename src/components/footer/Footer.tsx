import './Footer.css';

const Footer = () => {

  return <div className='footer'>
    <p>
      Made with{" "}
      <a
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-500 hover:underline"
      >
        React
      </a>
      {" + "}
      <a
        href="https://vite.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-500 hover:underline"
      >
        Vite
      </a>
      .
    </p>

    <p>
      © {new Date().getFullYear()} Sudoku by{" "}
      <a
        href="https://github.com/vistej"
        className="text-blue-500 hover:underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        vistej
      </a>
      .
    </p>
  </div>

}

export default Footer;