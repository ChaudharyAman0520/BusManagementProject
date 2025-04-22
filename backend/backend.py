import mysql.connector
import time
from mysql.connector import Error

# MySQL database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Aman@123',
            database='bus_management'
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
    return seats  # Already has seat_id and status

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

# =============== Fetch Filled Seats (used in /seat-layout) ===============
def fetch_filled_seats(bus_id):
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT seat_id FROM seats WHERE bus_id = %s AND status = 'filled'", (bus_id,))
    filled_seats = cursor.fetchall()
    conn.close()
    return [seat['seat_id'] for seat in filled_seats]

# =============== Allocate Seat ===============
def allocate_seat(student_id, bus_id, seat_id):
    retries = 3  # Number of retries
    delay = 2  # Time to wait before retrying in seconds
    
    for attempt in range(retries):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Try to update the seat status
            cursor.execute(
                "UPDATE seats SET status = 'filled' WHERE bus_id = %s AND seat_id = %s AND status = 'available'",
                (bus_id, seat_id)
            )

            # If no rows were affected, it means the seat was already filled
            if cursor.rowcount == 0:
                return {"status": "error", "message": "Seat is already booked"}

            conn.commit()
            conn.close()

            return {"status": "success", "message": "Seat booked successfully"}

        except Error as e:
            # Check for lock wait timeout or any other database errors
            if e.errno == 1205:  # Lock wait timeout error code
                if attempt < retries - 1:
                    time.sleep(delay)  # Wait before retrying
                    continue
                else:
                    return {"status": "error", "message": "Transaction timed out after several attempts"}
            else:
                return {"status": "error", "message": str(e)}


# =============== Register Student ===============
def register_student(student_id, name, password):
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO students (student_id, name, password) VALUES (%s, %s, %s)",
                       (student_id, name, password))
        conn.commit()
        return {"status": "success", "message": f"Student {name} registered successfully"}
    except mysql.connector.Error as err:
        if err.errno == 1062:
            return {"status": "error", "message": "Student ID already registered"}
        return {"status": "error", "message": str(err)}
    finally:
        conn.close()

# =============== Login Student ===============
def login_student(student_id, password):
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE student_id = %s AND password = %s",
                   (student_id, password))
    student = cursor.fetchone()
    conn.close()

    if student:
        return {"status": "success", "message": f"Student {student_id} logged in successfully"}
    return {"status": "error", "message": "Invalid student ID or password"}
