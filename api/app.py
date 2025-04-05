from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.json

    # Validate incoming data
    if not data or 'student_id' not in data or 'bus_id' not in data or 'preferred_seat' not in data:
        return jsonify({"status": "error", "message": "Invalid input"}), 400

    student_id = data.get('student_id')
    bus_id = data.get('bus_id')
    preferred_seat = data.get('preferred_seat')

    # Placeholder logic (this will later call C++ backend)
    response = {
        "status": "success",
        "message": f"Seat {preferred_seat} booked for student {student_id} on bus {bus_id}"
    }
    print("Response:", response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)