import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
const Navbar = () => (
  <nav>
    <h2>Secure File Sharing</h2>
    <div className="links">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/auth-login">AuthLogin</Link>
      <Link to="/auth-register">AuthRegister</Link>
      <Link to="/rolebased">RoleBased</Link>
      <Link to="/fileupload">FileUpload</Link>
      <Link to="/roleuser">RoleUser</Link>
      <Link to="/filedownload">FileDownload</Link></div>
  </nav>
);

export default Navbar;