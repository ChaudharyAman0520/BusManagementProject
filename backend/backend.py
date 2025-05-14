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
    return seats

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

# =============== Fetch Filled Seats for a Bus ===============
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
def allocate_seat(student_id, location):
    retries = 3
    delay = 2  # seconds

    for attempt in range(retries):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            # Step 1: Get a bus with available seats for the given location
            cursor.execute("""
                SELECT b.bus_id
                FROM buses b
                JOIN seats s ON b.bus_id = s.bus_id
                WHERE b.location = %s AND s.status = 'available'
                GROUP BY b.bus_id
                HAVING COUNT(s.seat_id) > 0
                ORDER BY b.bus_id
                LIMIT 1
            """, (location,))
            bus_result = cursor.fetchone()

            if not bus_result:
                return {"status": "error", "message": "No available buses or seats in your location"}

            bus_id = bus_result['bus_id']

            # Step 2: Get the lowest-numbered available seat
            cursor.execute("""
                SELECT seat_id
                FROM seats
                WHERE bus_id = %s AND status = 'available'
                ORDER BY seat_id
                LIMIT 1
            """, (bus_id,))
            seat_result = cursor.fetchone()

            if not seat_result:
                return {"status": "error", "message": "No available seat in selected bus"}

            seat_id = seat_result['seat_id']

            # Step 3: Try to update the seat status (optimistic locking)
            cursor.execute("""
                UPDATE seats
                SET status = 'filled'
                WHERE bus_id = %s AND seat_id = %s AND status = 'available'
            """, (bus_id, seat_id))

            if cursor.rowcount == 0:
                # Seat taken by another student in the meantime — retry
                if attempt < retries - 1:
                    time.sleep(delay)
                    continue
                return {"status": "error", "message": "Seat booking conflict. Please try again."}

            # Step 4: Create booking entry
            cursor.execute("""
                INSERT INTO bookings (student_id, bus_id, location, seat_id, booking_time)
                VALUES (%s, %s, %s, %s, NOW())
            """, (student_id, bus_id, location, seat_id))

            conn.commit()

            return {
                "status": "success",
                "message": f"Seat {seat_id} in Bus {bus_id} booked successfully.",
                "seat_id": seat_id,
                "bus_id": bus_id
            }

        except Error as e:
            if e.errno == 1205 and attempt < retries - 1:  # Lock wait timeout
                time.sleep(delay)
                continue
            return {"status": "error", "message": str(e)}
        
        finally:
            if conn:
                cursor.close()
                conn.close()


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

# =============== Admin Functions ===============

# Fetch Admin Stats (Example: total buses, total bookings, total students)
def get_admin_stats():
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = conn.cursor(dictionary=True)

    # Get total buses
    cursor.execute("SELECT COUNT(*) AS total_buses FROM buses")
    total_buses = cursor.fetchone()['total_buses']

    # Get total bookings
    cursor.execute("SELECT COUNT(*) AS total_bookings FROM bookings")
    total_bookings = cursor.fetchone()['total_bookings']

    # Get total students
    cursor.execute("SELECT COUNT(*) AS total_students FROM students")
    total_students = cursor.fetchone()['total_students']

    conn.close()

    return {
        "total_buses": total_buses,
        "total_bookings": total_bookings,
        "total_students": total_students
    }

# Fetch All Buses
def fetch_all_buses():
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM buses")
    buses = cursor.fetchall()
    conn.close()
    return buses

# Fetch All Bookings
def fetch_all_bookings():
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM bookings")
    bookings = cursor.fetchall()
    conn.close()
    return bookings

# Fetch All Seats (Details)
def fetch_all_seats():
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM seats")
    seats = cursor.fetchall()
    conn.close()
    return seats

def delete_seat(seat_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM seats WHERE seat_id = %s", (seat_id,))
        connection.commit()
        return {'status': 'success', 'message': 'Seat removed successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        if connection:
            cursor.close()
            connection.close()

def add_bus(bus_id, location):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Add bus to the buses table
        cursor.execute("INSERT INTO buses (bus_id, location) VALUES (%s, %s)", (bus_id, location))

        # Create 8 default seats for the bus (1A-1D, 2A-2D)
        seats = [
            ('1A', bus_id, location, 'available'),
            ('1B', bus_id, location, 'available'),
            ('1C', bus_id, location, 'available'),
            ('1D', bus_id, location, 'available'),
            ('1E', bus_id, location, 'available'),
            ('2A', bus_id, location, 'available'),
            ('2B', bus_id, location, 'available'),
            ('2C', bus_id, location, 'available'),
            ('2D', bus_id, location, 'available'),
            ('2E', bus_id, location, 'available')
        ]
        
        # Insert seats into the seats table
        cursor.executemany("INSERT INTO seats (seat_id, bus_id, location, status) VALUES (%s, %s, %s, %s)", seats)
        
        connection.commit()
        return {'status': 'success', 'message': 'Bus and seats added successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        if connection:
            cursor.close()
            connection.close()

# =============== Remove Bus and Associated Seats ===============
def remove_bus(bus_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # First, remove the seats associated with the bus
        cursor.execute("DELETE FROM seats WHERE bus_id = %s", (bus_id,))

        # Then, remove the bus itself from the buses table
        cursor.execute("DELETE FROM buses WHERE bus_id = %s", (bus_id,))
        
        connection.commit()
        return {'status': 'success', 'message': 'Bus and associated seats removed successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        if connection:
            cursor.close()
            connection.close()
