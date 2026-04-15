import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchRecipes();
    } else {
      navigate('/auth');
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/saved?username=${user}`);
      setRecipes(res.data.savedRecipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete('http://localhost:5000/api/recipes/delete', {
        data: { username: user, recipeId: id }
      });
      setRecipes(recipes.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const viewRecipe = (recipe) => {
    navigate('/result', { state: { recipe } });
  };

  if (!user) return null;

  return (
    <div className="fade-in max-w-4xl mx-auto mt-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <h2>Welcome, <span className="accent-text">{user}</span></h2>
        <div className="card py-2 px-4" style={{ borderRadius: '2rem' }}>
          <strong>{recipes.length}</strong> Saved Recipes
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-8">Loading your saved recipes...</p>
      ) : recipes.length === 0 ? (
        <div className="card text-center py-8">
          <p className="mb-4">You don't have any saved recipes yet.</p>
          <button onClick={() => navigate('/generate')} className="btn btn-primary">Generate Some Now</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {recipes.map(recipe => (
            <div key={recipe._id} className="card flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 style={{ fontSize: '1.25rem' }}>{recipe.title}</h4>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--input-bg)', borderRadius: '1rem' }}>
                    {recipe.cuisine || 'Custom'}
                  </span>
                </div>
                <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>
                  {recipe.calories} kcal • {recipe.cookingTime || '30 mins'} • {recipe.difficulty}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {recipe.allergens && recipe.allergens.map((alg, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.1rem 0.4rem', borderRadius: '0.5rem' }}>{alg}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button onClick={() => deleteRecipe(recipe._id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="flex items-center gap-1 hover:text-danger">
                  <Trash2 size={16} /> Delete
                </button>
                <button onClick={() => viewRecipe(recipe)} className="btn btn-secondary flex items-center gap-1 py-1 px-3">
                  View <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
