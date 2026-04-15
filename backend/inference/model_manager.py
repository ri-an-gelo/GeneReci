import os

# To simulate model loading
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models')
TEXT_MODEL_PATH = os.path.join(MODEL_PATH, 'text_model.pt')
IMAGE_MODEL_PATH = os.path.join(MODEL_PATH, 'image_model.pt')

# Here you would conditionally load PyTorch models
# Example: 
# if os.path.exists(TEXT_MODEL_PATH):
#     text_model = torch.load(...)
# else:
#     print("Warning: Model weights not found, using dummy fallback generator.")

def generate_text_recipe(input_text):
    """
    Simulates Seq2Seq Transformer output.
    """
    # Simple Mock Logic for fallback:
    ingredients_list = [i.strip() for i in input_text.split(',') if i.strip()]
    if not ingredients_list:
        ingredients_list = input_text.split()[:5] # Grab a few words words as ingredients
        
    return {
        "title": "Homestyle " + " ".join([i.capitalize() for i in ingredients_list[:2]]) + " Dish",
        "ingredients": [f"1 cup of {ing}" for ing in ingredients_list] + ["Salt and pepper to taste", "2 tbsp olive oil"],
        "instructions": [
            "Prepare all ingredients by washing and chopping as needed.",
            f"Heat olive oil in a pan over medium heat.",
            f"Add {', '.join(ingredients_list)} and sauté until cooked through.",
            "Season with salt and pepper. Serve hot and enjoy!"
        ],
        "cookingTime": "30 mins",
        "difficulty": "Medium",
        "cuisine": "Fusion"
    }

def generate_image_recipe(image_file):
    """
    Simulates ResNet50 + Decoder output.
    """
    # Since we can't run ResNet on the fly without weights, we return a mock structure.
    # We can use the filename or sizes to pseudo-randomize.
    return {
        "title": "AI Predicted Gourmet Meal",
        "ingredients": [
            "200g Chicken breast",
            "1 cup Jasmine rice",
            "1/2 cup Broccoli",
            "Soy sauce",
            "1 clove Garlic"
        ],
        "instructions": [
            "Cook the jasmine rice according to package instructions.",
            "Slice the chicken breast into bite-sized pieces.",
            "Stir-fry chicken and garlic in a wok.",
            "Add broccoli and soy sauce. Simmer until tender.",
            "Serve chicken and broccoli over the cooked rice."
        ],
        "cookingTime": "40 mins",
        "difficulty": "Hard",
        "cuisine": "Asian"
    }

def generate_cuisine_recipe(cuisine):
    """
    Simulates output given a cuisine style.
    """
    base_recipes = {
        "Italian": {
            "title": "Classic Italian Pasta",
            "ingredients": ["200g Pasta", "Tomatoes", "Basil", "Parmesan cheese", "Garlic"],
            "instructions": ["Boil water and cook pasta.", "Prepare tomato and basil sauce.", "Mix pasta with sauce and top with parmesan."]
        },
        "Mexican": {
            "title": "Authentic Taco Plates",
            "ingredients": ["Corn Tortillas", "Ground beef", "Cheddar cheese", "Lettuce", "Salsa"],
            "instructions": ["Cook ground beef with taco seasoning.", "Warm tortillas.", "Assemble tacos with beef, cheese, lettuce, and salsa."]
        },
        "Indian": {
            "title": "Creamy Chicken Curry",
            "ingredients": ["Chicken", "Curry powder", "Coconut milk", "Onion", "Rice"],
            "instructions": ["Sauté onions and spices.", "Add chicken and cook until browned.", "Pour in coconut milk and simmer.", "Serve with rice."]
        }
    }
    
    # Fallback to Italian if unknown
    rec = base_recipes.get(cuisine, base_recipes["Italian"])
    rec["cookingTime"] = "45 mins"
    rec["difficulty"] = "Medium"
    rec["cuisine"] = cuisine
    
    return rec
