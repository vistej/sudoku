import './Footer.css';

const Footer = () => {

  return <div className='footer'>
    <div className="footer-content">
      <p>
        Made with{" "}
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        {" + "}
        <a
          href="https://vite.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vite
        </a>
        {" + "}
        <a
          href="https://typescriptlang.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          TypeScript
        </a>
        .
      </p>
      <p>
        © {new Date().getFullYear()} Sudoku by{" "}
        <a
          href="https://github.com/vistej"
          target="_blank"
          rel="noopener noreferrer"
        >
          vistej
        </a>
        .
      </p>
    </div>
  </div>

}

export default Footer;