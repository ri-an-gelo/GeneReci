import { Link } from 'react-router-dom';
import { Utensils, Image as ImageIcon, Globe, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex-col items-center justify-center text-center mt-4 fade-in">
      <h1 className="mb-4">
        AI-Powered <span className="accent-text">Recipe Generation</span>
      </h1>
      <p className="mb-6" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        Turn whatever ingredients you have, a photo of food, or a craving for a specific cuisine into a delicious, step-by-step recipe with full nutritional breakdown.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', marginTop: '2rem' }}>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
            <Utensils size={40} />
          </div>
          <h3>Ingredient Magic</h3>
          <p className="mt-2 mb-4">List your ingredients and let AI craft the perfect dish.</p>
          <Link to="/generate?mode=text" className="btn btn-secondary w-full">
            Start Text Mode <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
            <ImageIcon size={40} />
          </div>
          <h3>Image to Recipe</h3>
          <p className="mt-2 mb-4">Upload a food photo and we'll reverse-engineer the recipe.</p>
          <Link to="/generate?mode=image" className="btn btn-secondary w-full">
            Start Image Mode <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
            <Globe size={40} />
          </div>
          <h3>Cuisine Explorer</h3>
          <p className="mt-2 mb-4">Pick a world cuisine and we'll generate an authentic recipe.</p>
          <Link to="/generate?mode=cuisine" className="btn btn-secondary w-full">
            Start Cuisine Mode <ArrowRight size={16} />
          </Link>
        </div>
        
      </div>
    </div>
  );
}
