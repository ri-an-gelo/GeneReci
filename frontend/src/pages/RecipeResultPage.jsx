import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import axios from 'axios';
import { Clock, ChefHat, Flame, AlertTriangle, Save, RefreshCw, Printer } from 'lucide-react';
import { AuthContext } from '../App';

export default function RecipeResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <div className="text-center mt-6">
        <h2>No recipe data found.</h2>
        <button onClick={() => navigate('/generate')} className="btn btn-primary mt-4">Go to Generator</button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) {
      alert("Please login first to save recipes");
      navigate('/auth');
      return;
    }
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/recipes/save', {
        username: user,
        recipe: recipe
      });
      alert('Recipe saved to your profile!');
    } catch (err) {
      alert('Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const calculatePercentage = (val, max) => Math.min((val / max) * 100, 100);

  return (
    <div className="slide-up max-w-4xl mx-auto" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      <div className="flex justify-between items-center mt-4 mb-6">
        <h1 className="accent-text" style={{ fontSize: '2.5rem' }}>{recipe.title}</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={18} /> Print
          </button>
          <button onClick={() => navigate('/generate')} className="btn btn-secondary">
            <RefreshCw size={18} /> Retry
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'reapto-fit, minmax(200px, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card flex items-center justify-center gap-2" style={{ padding: '1rem' }}>
          <Clock className="accent-text" /> <strong>{recipe.cookingTime || "30 mins"}</strong>
        </div>
        <div className="card flex items-center justify-center gap-2" style={{ padding: '1rem' }}>
          <ChefHat className="accent-text" /> <strong>{recipe.difficulty || "Medium"}</strong>
        </div>
        <div className="card flex items-center justify-center gap-2" style={{ padding: '1rem' }}>
          <Flame color="#ef4444" /> <strong>{recipe.calories || "Unknown"} kcal</strong>
        </div>
      </div>

      {recipe.allergens && recipe.allergens.length > 0 && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
          <AlertTriangle />
          <strong>Allergen Warning:</strong> Contains {recipe.allergens.join(', ')}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Ingredients & Nutrition */}
        <div className="card flex-col gap-4">
          <h3>Ingredients</h3>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Nutrition Est.</h3>
          <div className="flex-col gap-2">
            <div>
              <div className="flex justify-between text-sm">
                <span>Protein ({recipe.nutrition?.protein || 0}g)</span>
              </div>
              <div className="nutrition-bar-container">
                <div className="nutrition-bar-fill" style={{ width: `${calculatePercentage(recipe.nutrition?.protein || 0, 100)}%`, backgroundColor: '#3b82f6' }}></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Carbs ({recipe.nutrition?.carbs || 0}g)</span>
              </div>
              <div className="nutrition-bar-container">
                <div className="nutrition-bar-fill" style={{ width: `${calculatePercentage(recipe.nutrition?.carbs || 0, 300)}%`, backgroundColor: '#eab308' }}></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Fats ({recipe.nutrition?.fats || 0}g)</span>
              </div>
              <div className="nutrition-bar-container">
                <div className="nutrition-bar-fill" style={{ width: `${calculatePercentage(recipe.nutrition?.fats || 0, 100)}%`, backgroundColor: '#ef4444' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <h3>Instructions</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {recipe.instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ paddingTop: '0.2rem' }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
