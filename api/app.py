import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
import backend  # Import the backend functions that handle DB logic

app = Flask(__name__)
CORS(app)

# =============== Fetch Locations ===============
@app.route('/locations', methods=['GET'])
def get_locations():
    locations = backend.fetch_locations()  # Call the function from backend.py
    return jsonify({"locations": [location['location'] for location in locations]})

# =============== Fetch Buses for a Location ===============
@app.route('/buses/<location>', methods=['GET'])
def get_buses(location):
    buses = backend.fetch_buses_for_location(location)  # Call the function from backend.py
    if buses:
        return jsonify({"buses": [bus['bus_id'] for bus in buses]})
    return jsonify({"buses": []}), 404

# =============== Seat Status for a Bus ===============
@app.route('/seat-status/<bus_id>', methods=['GET'])
def seat_status(bus_id):
    seats = backend.fetch_seat_status(bus_id)
    
    if not seats:
        return jsonify({"message": "No seat data found for this bus"}), 404

    return jsonify({"seats": [{"seat_id": seat} for seat in seats]})

# =============== Allocate Seat ===============
@app.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.json
    if not data or 'student_id' not in data or 'bus_id' not in data:
        return jsonify({"status": "error", "message": "Invalid input"}), 400

    student_id = data.get('student_id')
    bus_id = data.get('bus_id')

    # Fetch available seats for the selected bus
    available_seats = backend.fetch_available_seats(bus_id)

    if not available_seats:
        return jsonify({"status": "error", "message": "No available seats"}), 400

    # Automatically allocate the first available seat
    allocated_seat = available_seats[0]  # Assuming the first available seat is allocated

    # Allocate the seat (this could be updated based on your DB logic)
    allocation_result = backend.allocate_seat(student_id, bus_id, allocated_seat)

    if allocation_result["status"] == "success":
        return jsonify({"status": "success", "seat_id": allocated_seat})
    
    return jsonify({"status": "error", "message": "Failed to allocate seat"}), 500

# =============== Register Student ===============
@app.route('/register', methods=['POST'])
def register_student():
    data = request.json
    if not data or 'student_id' not in data or 'name' not in data or 'password' not in data:
        return jsonify({"status": "error", "message": "Invalid registration input"}), 400

    student_id = data.get('student_id')
    name = data.get('name')
    password = data.get('password')

    result = backend.register_student(student_id, name, password)  # Call backend function

    return jsonify(result)

# =============== Login Student ===============
@app.route('/login', methods=['POST'])
def login_student():
    data = request.json
    if not data or 'student_id' not in data or 'password' not in data:
        return jsonify({"status": "error", "message": "Invalid login input"}), 400

    student_id = data.get('student_id')
    password = data.get('password')

    result = backend.login_student(student_id, password)  # Call backend function

    # If login is successful
    if result["status"] == "success":
        return jsonify(result)

    # If login fails
    return jsonify(result), 401

# =============== Seat Layout for a Bus ===============
@app.route('/seat-layout/<bus_id>', methods=['GET'])
def seat_layout(bus_id):
    # Fetching seat layout based on a bus id (you can modify this logic if needed)
    seats = backend.fetch_seat_status(bus_id)  # Fetch seats dynamically from the backend
    
    if not seats:
        return jsonify({"status": "error", "message": "No seat data found for this bus"}), 404
    
    seat_layout = [{"seat_id": seat, "status": "available" if seat not in backend.fetch_filled_seats(bus_id) else "filled"} for seat in seats]
    
    # Returning the seat layout as JSON
    return jsonify({"bus_id": bus_id, "seats": seat_layout})


if __name__ == '__main__':
    app.run(debug=True)
