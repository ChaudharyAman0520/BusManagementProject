import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

import backend

app = Flask(__name__)
CORS(app)

# Static admin credentials
VALID_ADMIN_USERNAME = 'admin'
VALID_ADMIN_PASSWORD = 'admin123'


# =============== Public Routes ===============

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


# =============== Admin Routes ===============

@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    admin_username = data.get('username')
    admin_password = data.get('password')

    # Validate the static admin credentials
    if admin_username == VALID_ADMIN_USERNAME and admin_password == VALID_ADMIN_PASSWORD:
        return jsonify({'status': 'success', 'message': 'Admin login successful!'}), 200
    else:
        return jsonify({'status': 'failure', 'message': 'Invalid username or password.'}), 401


@app.route('/admin/stats', methods=['GET'])
def admin_stats():
    stats = backend.get_admin_stats()
    return jsonify(stats)

@app.route('/admin/buses', methods=['GET'])
def admin_buses():
    buses = backend.fetch_all_buses()
    return jsonify({'buses': buses})


@app.route('/admin/bookings', methods=['GET'])
def admin_bookings():
    bookings = backend.fetch_all_bookings()
    return jsonify({'bookings': bookings})


@app.route('/admin/seats', methods=['GET'])
def admin_seats():
    seats = backend.fetch_all_seats()
    return jsonify({'seats': seats})


# =============== Public Routes for Students ===============

@app.route('/locations', methods=['GET'])
def get_locations():
    locations = backend.fetch_locations()
    return jsonify({"locations": [loc['location'] for loc in locations]})


@app.route('/buses/<location>', methods=['GET'])
def get_buses(location):
    buses = backend.fetch_buses_for_location(location)
    return jsonify({"buses": buses})


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

@app.route('/admin/remove-seat/<seat_id>', methods=['DELETE'])
def remove_seat_route(seat_id):
    result = backend.delete_seat(seat_id)
    return jsonify(result)

@app.route('/admin/add-bus', methods=['POST'])
def add_bus():
    data = request.json
    bus_id = data['bus_id']
    location = data['location']
    result = backend.add_bus(bus_id, location)
    return jsonify(result)

@app.route('/admin/remove-bus/<bus_id>', methods=['DELETE'])
def remove_bus(bus_id):
    result = backend.remove_bus(bus_id)
    return jsonify(result)

# =============== Run the Flask app ===============
if __name__ == '__main__':
    app.run(debug=True)
