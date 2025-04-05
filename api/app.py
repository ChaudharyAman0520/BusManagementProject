from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/allocate-seat', methods=['POST'])
def allocate_seat():
    data = request.json
    student_id = data.get('student_id')
    bus_id = data.get('bus_id')
    preferred_seat = data.get('preferred_seat')

    # Placeholder logic (this will later call C++ backend)
    response = {
        "status": "success",
        "message": f"Seat {preferred_seat} booked for student {student_id} on bus {bus_id}"
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
