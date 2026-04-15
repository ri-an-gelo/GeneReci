from flask import Blueprint, request, jsonify
from utils.nutrition_db import calculate_nutrition_and_allergens
from inference.model_manager import generate_text_recipe, generate_image_recipe, generate_cuisine_recipe

generate_bp = Blueprint('generate', __name__)

@generate_bp.route('/text', methods=['POST'])
def generate_text():
    data = request.json
    input_text = data.get('input', '')
    
    if not input_text:
        return jsonify({"error": "Input text/ingredients required"}), 400
    
    # Pass to inference model (mock or real)
    recipe_data = generate_text_recipe(input_text)
    
    # Calculate nutrition and allergens
    enriched_recipe = calculate_nutrition_and_allergens(recipe_data)
    
    return jsonify(enriched_recipe), 200

@generate_bp.route('/image', methods=['POST'])
def generate_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    image_file = request.files['image']
    
    # Pass image file to inference model
    recipe_data = generate_image_recipe(image_file)
    
    # Calculate nutrition and allergens
    enriched_recipe = calculate_nutrition_and_allergens(recipe_data)
    
    return jsonify(enriched_recipe), 200

@generate_bp.route('/cuisine', methods=['POST'])
def generate_cuisine():
    data = request.json
    cuisine = data.get('cuisine', 'Italian')
    
    recipe_data = generate_cuisine_recipe(cuisine)
    
    # Calculate nutrition and allergens
    enriched_recipe = calculate_nutrition_and_allergens(recipe_data)
    
    return jsonify(enriched_recipe), 200
