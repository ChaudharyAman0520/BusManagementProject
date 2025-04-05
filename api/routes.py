from flask import Blueprint, request, jsonify
from cplusplus_bridge import run_seat_allocator

seat_routes = Blueprint('seat_routes', __name__)

@seat_routes.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.get_json()
    student_id = data.get("student_id")
    bus_id = data.get("bus_id")
    preferred_seat = data.get("preferred_seat")

    result = run_seat_allocator(student_id, bus_id, preferred_seat)
    return jsonify(result)
