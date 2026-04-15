import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Moon, Sun, User as UserIcon, LogOut } from 'lucide-react';
import { ThemeContext, AuthContext } from '../App';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <ChefHat size={28} color="var(--accent-primary)" />
        RecipeBowl
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/generate" className="nav-link">Generate</Link>
            <Link to="/profile" className="nav-link">
              <UserIcon size={20} />
            </Link>
            <button onClick={handleLogout} className="nav-link" style={{background:'none', border:'none', cursor:'pointer'}}>
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Sign In</Link>
        )}
        
        <button 
          onClick={toggleTheme} 
          style={{background:'none', border:'none', cursor:'pointer', color: 'var(--text-secondary)'}}
          title="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>
      </div>
    </nav>
  );
}
