import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <h2>Secure File Sharing</h2>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </nav>
);

export default Navbar;