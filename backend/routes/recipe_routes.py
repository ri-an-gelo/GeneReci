from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from datetime import datetime

recipe_bp = Blueprint('recipes', __name__)

@recipe_bp.route('/save', methods=['POST'])
def save_recipe():
    data = request.json
    username = data.get('username')
    recipe_data = data.get('recipe')
    
    if not username or not recipe_data:
        return jsonify({"error": "Username and recipe required"}), 400
        
    db = current_app.config['DB']
    
    # Insert recipe to recipes collection
    recipe_data['createdAt'] = datetime.utcnow()
    result = db.recipes.insert_one(recipe_data)
    recipe_id = str(result.inserted_id)
    
    # Add to user's saved array
    db.users.update_one(
        {"username": username},
        {"$push": {"savedRecipes": recipe_id}}
    )
    
    return jsonify({"message": "Recipe saved", "recipeId": recipe_id}), 201

@recipe_bp.route('/saved', methods=['GET'])
def get_saved_recipes():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username required"}), 400
        
    db = current_app.config['DB']
    user = db.users.find_one({"username": username})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    recipe_ids = user.get('savedRecipes', [])
    object_ids = [ObjectId(rid) for rid in recipe_ids]
    
    recipes_cursor = db.recipes.find({"_id": {"$in": object_ids}})
    recipes = []
    for r in recipes_cursor:
        r['_id'] = str(r['_id'])
        recipes.append(r)
        
    return jsonify({"savedRecipes": recipes}), 200

@recipe_bp.route('/delete', methods=['DELETE'])
def delete_recipe():
    data = request.json
    username = data.get('username')
    recipe_id = data.get('recipeId')
    
    if not username or not recipe_id:
        return jsonify({"error": "Username and recipeId required"}), 400
        
    db = current_app.config['DB']
    
    # Remove from user's list
    db.users.update_one(
        {"username": username},
        {"$pull": {"savedRecipes": recipe_id}}
    )
    
    # Optionally remove from recipes collection if no one else has it saved
    # For simplicity, we just delete it outright
    db.recipes.delete_one({"_id": ObjectId(recipe_id)})
    
    return jsonify({"message": "Recipe deleted"}), 200
