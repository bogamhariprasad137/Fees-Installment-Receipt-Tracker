from flask import Blueprint, request, jsonify
from app.database import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    role = data.get('role', '')
    
    if not email or not role:
        return jsonify({"success": False, "message": "Email and role are required."}), 400
        
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE LOWER(email) = %s AND role = %s", (email, role))
            user = cursor.fetchone()
            
        if not user:
            return jsonify({"success": False, "message": "Invalid credentials. User not found."}), 401
            
        # Return user info matching what frontend expects
        return jsonify({
            "success": True,
            "user": {
                "user_id": user['user_id'],
                "firebase_uid": user['firebase_uid'] or f"uid-{user['user_id']}",
                "email": user['email'],
                "role": user['role']
            }
        })
    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400
        
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # 1. Verify if email is pre-registered in students as parent_email
            cursor.execute("SELECT * FROM students WHERE LOWER(parent_email) = %s", (email,))
            student_match = cursor.fetchone()
            
            if not student_match:
                return jsonify({"success": False, "message": "Self-signup blocked: Parent email is not pre-registered by school administration."}), 403
                
            # 2. Check if user already exists
            cursor.execute("SELECT * FROM users WHERE LOWER(email) = %s", (email,))
            existing_user = cursor.fetchone()
            
            if existing_user:
                return jsonify({
                    "success": True,
                    "user": {
                        "user_id": existing_user['user_id'],
                        "firebase_uid": existing_user['firebase_uid'] or f"uid-{existing_user['user_id']}",
                        "email": existing_user['email'],
                        "role": existing_user['role']
                    }
                })
                
            # 3. Create new user
            firebase_uid = f"uid-{email.split('@')[0]}"
            cursor.execute(
                "INSERT INTO users (firebase_uid, email, role) VALUES (%s, %s, 'parent')",
                (firebase_uid, email)
            )
            new_id = cursor.lastrowid
            
            # 4. Link existing student records to this new user_id
            cursor.execute(
                "UPDATE students SET user_id = %s WHERE LOWER(parent_email) = %s",
                (new_id, email)
            )
            
            return jsonify({
                "success": True,
                "user": {
                    "user_id": new_id,
                    "firebase_uid": firebase_uid,
                    "email": email,
                    "role": "parent"
                }
            })
    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400
        
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE LOWER(email) = %s", (email,))
            user = cursor.fetchone()
            
        if not user:
            return jsonify({"success": False, "message": "No account registered with this email address."}), 404
            
        return jsonify({"success": True, "message": f"Simulated password reset email dispatched to {email}."})
    except Exception as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
