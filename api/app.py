from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ================== Seat Allocation ====================
@app.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.json
    if not data or 'student_id' not in data or 'bus_id' not in data or 'preferred_seat' not in data:
        return jsonify({"status": "error", "message": "Invalid input"}), 400

    student_id = data.get('student_id')
    bus_id = data.get('bus_id')
    preferred_seat = data.get('preferred_seat')

    # Placeholder logic (call C++ backend here)
    response = {
        "status": "success",
        "message": f"Seat {preferred_seat} booked for student {student_id} on bus {bus_id}"
    }
    print("Response:", response)
    return jsonify(response)

# ================== Student Registration ====================
@app.route('/register', methods=['POST'])
def register_student():
    data = request.json
    if not data or 'student_id' not in data or 'name' not in data or 'password' not in data:
        return jsonify({"status": "error", "message": "Invalid registration input"}), 400

    student_id = data.get('student_id')
    name = data.get('name')
    password = data.get('password')

    # TODO: Replace with real C++ call to save user
    print(f"Registering student {student_id} - {name}")

    return jsonify({"status": "success", "message": f"Student {name} registered successfully"})

# ================== Student Login ====================
@app.route('/login', methods=['POST'])
def login_student():
    data = request.json
    if not data or 'student_id' not in data or 'password' not in data:
        return jsonify({"status": "error", "message": "Invalid login input"}), 400

    student_id = data.get('student_id')
    password = data.get('password')

    # TODO: Replace with actual login check via C++ backend
    print(f"Logging in student {student_id}")
    
    # Just mocking success for now
    return jsonify({"status": "success", "message": f"Student {student_id} logged in successfully"})

@app.route('/seat-status/<bus_id>', methods=['GET'])
def seat_status(bus_id):
    # Placeholder logic - eventually call C++ backend or DB
    filled_seats = ['1A', '2B', '3C']  # Dummy data
    return jsonify({"filled_seats": filled_seats})


if __name__ == '__main__':
    app.run(debug=True)
