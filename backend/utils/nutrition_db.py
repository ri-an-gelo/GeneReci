import re

# Offline Database for common ingredients
NUTRITION_DB = {
    "egg": {"calories": 70, "protein": 6, "carbs": 0, "fats": 5, "allergens": ["eggs"]},
    "milk": {"calories": 103, "protein": 8, "carbs": 12, "fats": 2, "allergens": ["dairy"]},
    "cheese": {"calories": 113, "protein": 7, "carbs": 1, "fats": 9, "allergens": ["dairy"]},
    "chicken": {"calories": 165, "protein": 31, "carbs": 0, "fats": 3.6, "allergens": []},
    "rice": {"calories": 206, "protein": 4.3, "carbs": 45, "fats": 0.4, "allergens": []},
    "beef": {"calories": 250, "protein": 26, "carbs": 0, "fats": 15, "allergens": []},
    "flour": {"calories": 364, "protein": 10, "carbs": 76, "fats": 1, "allergens": ["gluten"]},
    "peanut": {"calories": 567, "protein": 25.8, "carbs": 16, "fats": 49, "allergens": ["nuts"]},
    "almond": {"calories": 579, "protein": 21, "carbs": 21, "fats": 49, "allergens": ["nuts"]},
    "shrimp": {"calories": 99, "protein": 24, "carbs": 0.2, "fats": 0.3, "allergens": ["seafood"]},
    "salmon": {"calories": 208, "protein": 20, "carbs": 0, "fats": 13, "allergens": ["seafood"]},
    "pasta": {"calories": 131, "protein": 5, "carbs": 25, "fats": 1, "allergens": ["gluten"]},
    "butter": {"calories": 717, "protein": 0.8, "carbs": 0.1, "fats": 81, "allergens": ["dairy"]},
}

DEFAULT_MACROS = {"calories": 50, "protein": 1, "carbs": 5, "fats": 1, "allergens": []}

def calculate_nutrition_and_allergens(recipe_data):
    """
    Takes a generated recipe dictionary, scans the text/ingredients,
    and returns it enriched with estimated nutrition and allergens.
    """
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fats = 0
    detected_allergens = set()
    
    ingredients = recipe_data.get('ingredients', [])
    combined_ingredients_text = " ".join(ingredients).lower()
    
    for word, stats in NUTRITION_DB.items():
        # Match whole word to avoid partial matches
        if re.search(r'\b' + re.escape(word) + r'\b', combined_ingredients_text):
             # Simplified: assuming 1 serving/unit of each matched ingredient for the mock
             total_calories += stats["calories"]
             total_protein += stats["protein"]
             total_carbs += stats["carbs"]
             total_fats += stats["fats"]
             for a in stats["allergens"]:
                 detected_allergens.add(a)
                 
    # If no known ingredients were found, apply a generic baseline
    if total_calories == 0:
        total_calories = 350
        total_protein = 15
        total_carbs = 40
        total_fats = 12
        
    recipe_data['calories'] = round(total_calories)
    recipe_data['nutrition'] = {
        "protein": round(total_protein, 1),
        "carbs": round(total_carbs, 1),
        "fats": round(total_fats, 1)
    }
    recipe_data['allergens'] = list(detected_allergens)
    
    return recipe_data
