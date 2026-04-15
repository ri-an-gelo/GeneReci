import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Image as ImageIcon, Search } from 'lucide-react';

export default function GeneratorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') || 'text';
  
  const [mode, setMode] = useState(initialMode);
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [cuisine, setCuisine] = useState('Italian');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let res;
      if (mode === 'text') {
        res = await axios.post('http://localhost:5000/api/generate/text', { input: inputText });
      } else if (mode === 'image') {
        const formData = new FormData();
        formData.append('image', imageFile);
        res = await axios.post('http://localhost:5000/api/generate/image', formData);
      } else if (mode === 'cuisine') {
        res = await axios.post('http://localhost:5000/api/generate/cuisine', { cuisine });
      }
      
      // Navigate to results page with data
      navigate('/result', { state: { recipe: res.data } });
    } catch (err) {
      alert('Failed to generate recipe. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-center mb-6 text-2xl font-bold mt-4">
        <Sparkles className="inline mr-2 accent-text" /> 
        Recipe Generator
      </h2>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4 mb-6">
        {['text', 'image', 'cuisine'].map(m => (
          <button 
            key={m}
            className={`btn ${mode === m ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)} Mode
          </button>
        ))}
      </div>

      <div className="card">
        <form onSubmit={handleGenerate}>
          
          {mode === 'text' && (
            <div className="input-group">
              <label className="input-label">What ingredients do you have?</label>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="E.g., chicken breast, rice, tomatoes, garlic..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                required
              ></textarea>
              <p className="mt-2 text-sm text-secondary">You can just type whatever is in your fridge.</p>
            </div>
          )}

          {mode === 'image' && (
            <div className="input-group">
              <label className="input-label">Upload Food Image</label>
              <div 
                style={{ 
                  border: '2px dashed var(--border-color)', 
                  padding: '2rem', 
                  textAlign: 'center', 
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  backgroundColor: 'var(--input-bg)'
                }}
              >
                <ImageIcon size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto' }} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setImageFile(e.target.files[0])} 
                  required 
                />
              </div>
            </div>
          )}

          {mode === 'cuisine' && (
            <div className="input-group">
              <label className="input-label">Select Cuisine Style</label>
              <select 
                className="input-field"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
              >
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Indian">Indian</option>
                <option value="Asian">Asian (General)</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="American">American</option>
              </select>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              {loading ? 'Generating...' : 'Generate Recipe'}
            </button>
          </div>
          
          {loading && (
            <div className="text-center mt-4 slide-up">
              <p>Our AI is crafting your recipe. This might take a few seconds...</p>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
