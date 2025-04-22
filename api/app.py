import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
import backend
app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    student_id = data['student_id']
    name = data['name']
    password = data['password']
    result = backend.register_student(student_id, name, password)
    return jsonify(result)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    student_id = data['student_id']
    password = data['password']
    result = backend.login_student(student_id, password)
    return jsonify(result)

@app.route('/locations', methods=['GET'])
def get_locations():
    locations = backend.fetch_locations()
    print('Fetched locations:', locations)  # Optional: For debugging
    return jsonify({"locations": [loc['location'] for loc in locations]})

@app.route('/buses/<location>', methods=['GET'])
def get_buses(location):
    buses = backend.fetch_buses_for_location(location)
    print('Fetched buses:', buses)
    return jsonify({"buses": buses})  # <-- wrap in "buses" key

@app.route('/seat-status/<bus_id>', methods=['GET'])
def seat_status(bus_id):
    seats = backend.fetch_seat_status(bus_id)
    return jsonify({"seats": seats})  # Directly return seat_id and status

@app.route('/seat-layout/<bus_id>', methods=['GET'])
def seat_layout(bus_id):
    seats = backend.fetch_seat_status(bus_id)
    return jsonify({"bus_id": bus_id, "seats": seats})

@app.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.json
    student_id = data['student_id']
    bus_id = data['bus_id']
    preferred_seat = data['seat_id']
    result = backend.allocate_seat(student_id, bus_id, preferred_seat)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
