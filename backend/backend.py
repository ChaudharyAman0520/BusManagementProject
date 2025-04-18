import mysql.connector

# MySQL database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',  # Replace with your MySQL username
            password='Aman@123',  # Replace with your MySQL password
            database='bus_management'  # Database name
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

# =============== Fetch Locations ===============
def fetch_locations():
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT location FROM buses")
    locations = cursor.fetchall()
    conn.close()
    return locations

# =============== Fetch Buses for a Location ===============
def fetch_buses_for_location(location):
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT bus_id FROM buses WHERE location = %s", (location,))
    buses = cursor.fetchall()
    conn.close()
    return buses

# =============== Fetch Seat Status for a Bus ===============
def fetch_seat_status(bus_id):
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT seat_id, status FROM seats WHERE bus_id = %s", (bus_id,))
    seats = cursor.fetchall()
    conn.close()

    # Returning seat IDs along with their status (either 'available' or 'filled')
    return [{"seat_id": seat['seat_id'], "status": seat['status']} for seat in seats]

# =============== Fetch Available Seats for a Bus ===============
def fetch_available_seats(bus_id):
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT seat_id FROM seats WHERE bus_id = %s AND status = 'available'", (bus_id,))
    available_seats = cursor.fetchall()
    conn.close()
    return [seat['seat_id'] for seat in available_seats]

# =============== Allocate Seat ===============
def allocate_seat(student_id, bus_id, preferred_seat):
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}, 500

    cursor = conn.cursor(dictionary=True)
    
    # Check if the seat is already filled
    cursor.execute("SELECT seat_id FROM seats WHERE bus_id = %s AND seat_id = %s AND status = 'filled'", 
                   (bus_id, preferred_seat))
    seat_taken = cursor.fetchone()
    
    if seat_taken:
        conn.close()
        return {"status": "error", "message": "Seat already taken"}, 409

    # Allocate the seat (update status in database)
    cursor.execute("UPDATE seats SET status = 'filled' WHERE bus_id = %s AND seat_id = %s AND status = 'available'", 
                   (bus_id, preferred_seat))
    
    # Insert booking into the bookings table
    cursor.execute("INSERT INTO bookings (student_id, bus_id, seat_id) VALUES (%s, %s, %s)", 
                   (student_id, bus_id, preferred_seat))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": f"Seat {preferred_seat} booked for student {student_id} on bus {bus_id}"
    }

# =============== Register Student ===============
def register_student(student_id, name, password):
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}, 500
    cursor = conn.cursor()
    cursor.execute("INSERT INTO students (student_id, name, password) VALUES (%s, %s, %s)", 
                   (student_id, name, password))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Student {name} registered successfully"}

# =============== Login Student ===============
def login_student(student_id, password):
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}, 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE student_id = %s AND password = %s", 
                   (student_id, password))
    student = cursor.fetchone()
    conn.close()

    if student:
        return {"status": "success", "message": f"Student {student_id} logged in successfully"}
    return {"status": "error", "message": "Invalid student ID or password"}
