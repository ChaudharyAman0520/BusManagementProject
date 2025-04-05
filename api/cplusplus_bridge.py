# Later this will call your C++ backend
# For now, just mocking the response

def run_seat_allocator(student_id, bus_id, seat):
    return {
        "status": "success",
        "message": f"Seat {seat} booked for student {student_id} on bus {bus_id}"
    }
