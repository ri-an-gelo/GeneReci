from flask import Blueprint, request, jsonify, current_app
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400
        
    db = current_app.config['DB']
    users = db.users
    
    # Check if user exists
    if users.find_one({"username": data['username']}):
        return jsonify({"error": "Username already exists"}), 409
        
    # Hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), salt)
    
    user = {
        "username": data['username'],
        "password": hashed,
        "savedRecipes": []
    }
    
    users.insert_one(user)
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400
        
    db = current_app.config['DB']
    users = db.users
    
    user = users.find_one({"username": data['username']})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
        
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        # We can implement JWT here. For now, returning the username as token equivalent.
        return jsonify({
            "message": "Login successful", 
            "username": user['username'],
            "token": f"mock_jwt_token_for_{user['username']}"
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
