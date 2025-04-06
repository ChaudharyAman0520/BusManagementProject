from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dummy data for locations and buses
location_to_buses = {
    "Dehradun": ["BUS101", "BUS102"],
    "Rishikesh": ["BUS201", "BUS202"],
    "Mussoorie": ["BUS301", "BUS302"],
    "Haridwar": ["BUS401", "BUS402"]
}

# Dummy seat data for buses
bus_seat_data = {
    "BUS101": ["1A", "2B"],
    "BUS102": ["3C"],
    "BUS201": [],
    "BUS202": ["4D", "5A"],
    "BUS301": ["1A"],
    "BUS302": [],
    "BUS401": ["2B", "3C", "4D"],
    "BUS402": []
}

# =============== Fetch Locations ===============
@app.route('/locations', methods=['GET'])
def get_locations():
    return jsonify({"locations": list(location_to_buses.keys())})

# =============== Fetch Buses for a Location ===============
@app.route('/buses/<location>', methods=['GET'])
def get_buses(location):
    buses = location_to_buses.get(location)
    if buses:
        return jsonify({"buses": buses})
    return jsonify({"buses": []}), 404

# =============== Seat Status for a Bus ===============
@app.route('/seat-status/<bus_id>', methods=['GET'])
def seat_status(bus_id):
    filled_seats = bus_seat_data.get(bus_id, [])
    return jsonify({"filled_seats": filled_seats})

# =============== Allocate Seat ===============
@app.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.json
    if not data or 'student_id' not in data or 'bus_id' not in data or 'preferred_seat' not in data:
        return jsonify({"status": "error", "message": "Invalid input"}), 400

    student_id = data.get('student_id')
    bus_id = data.get('bus_id')
    preferred_seat = data.get('preferred_seat')

    # Mock seat assignment
    if bus_id not in bus_seat_data:
        return jsonify({"status": "error", "message": "Invalid bus ID"}), 404

    if preferred_seat in bus_seat_data[bus_id]:
        return jsonify({"status": "error", "message": "Seat already taken"}), 409

    bus_seat_data[bus_id].append(preferred_seat)

    return jsonify({
        "status": "success",
        "message": f"Seat {preferred_seat} booked for student {student_id} on bus {bus_id}"
    })

# =============== Registration ===============
@app.route('/register', methods=['POST'])
def register_student():
    data = request.json
    if not data or 'student_id' not in data or 'name' not in data or 'password' not in data:
        return jsonify({"status": "error", "message": "Invalid registration input"}), 400

    print(f"Registering student {data['student_id']} - {data['name']}")
    return jsonify({"status": "success", "message": f"Student {data['name']} registered successfully"})

# =============== Login ===============
@app.route('/login', methods=['POST'])
def login_student():
    data = request.json
    if not data or 'student_id' not in data or 'password' not in data:
        return jsonify({"status": "error", "message": "Invalid login input"}), 400

    print(f"Logging in student {data['student_id']}")
    return jsonify({"status": "success", "message": f"Student {data['student_id']} logged in successfully"})

if __name__ == '__main__':
    app.run(debug=True)
