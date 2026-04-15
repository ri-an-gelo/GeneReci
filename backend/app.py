import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient

# Load Environment Variables
load_dotenv()

app = Flask(__name__)
# Allow requests from the Vite frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Setup Database Connection
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/recipebowl")
client = MongoClient(mongo_uri)
db = client.get_default_database() if client.get_default_database().name else client['recipebowl']

# Make db available to routes (import inside functions or setup a db module)
app.config['DB'] = db

# Import Routes
from routes.auth_routes import auth_bp
from routes.generate_routes import generate_bp
from routes.recipe_routes import recipe_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(generate_bp, url_prefix='/api/generate')
app.register_blueprint(recipe_bp, url_prefix='/api/recipes')

@app.route("/")
def index():
    return jsonify({"message": "Welcome to Homemade RecipeBowl API. The server is running."})

# Global Error Handler
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error", "details": str(error)}), 500

if __name__ == '__main__':
    # Using port 5000 by default
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
