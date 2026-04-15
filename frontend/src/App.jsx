import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// We will create these pages next
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import GeneratorPage from './pages/GeneratorPage';
import RecipeResultPage from './pages/RecipeResultPage';
import ProfilePage from './pages/ProfilePage';

export const ThemeContext = createContext();
export const AuthContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const savedUser = localStorage.getItem('recipebowl_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const login = (username) => {
    setUser(username);
    localStorage.setItem('recipebowl_user', username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('recipebowl_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Router>
          <div className="app-container fade-in">
            <Navbar />
            <main className="container slide-up">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/generate" element={<GeneratorPage />} />
                <Route path="/result" element={<RecipeResultPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
