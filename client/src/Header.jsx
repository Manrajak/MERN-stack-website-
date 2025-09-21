import { Link, useNavigate } from "react-router-dom";
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">MERN Dashboard</Link>
        <div>
          <Link className="nav-link d-inline" to="/add-agent">Agents</Link>
          <Link className="nav-link d-inline" to="/upload-list">Upload List</Link>
          <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;