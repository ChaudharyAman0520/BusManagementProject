import pymysql
import pymysql.cursors
import time
import heapq

# MySQL database connection using PyMySQL
def get_db_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='1234',
            database='bus_management',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.MySQLError as err:
        print(f"Error: {err}")
        return None

# =============== Helper to fetch all results ===============
def _fetch_all(query, params=None):
    conn = get_db_connection()
    if not conn:
        return []
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query, params or ())
        result = cursor.fetchall()
        return result
    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        conn.close()

# =============== Fetch Locations ===============
def fetch_locations():
    query = "SELECT DISTINCT location FROM buses"
    return _fetch_all(query)

# =============== Fetch Buses for a Location ===============
def fetch_buses_for_location(location):
    query = "SELECT bus_id FROM buses WHERE location = %s"
    return _fetch_all(query, (location,))

# =============== Fetch Seat Status for a Bus ===============
def fetch_seat_status(bus_id):
    query = "SELECT seat_id, status FROM seats WHERE bus_id = %s"
    return _fetch_all(query, (bus_id,))

# =============== Fetch Available Seats for a Bus ===============
def fetch_available_seats(bus_id):
    query = "SELECT seat_id FROM seats WHERE bus_id = %s AND status = 'available'"
    seats = _fetch_all(query, (bus_id,))
    return [seat['seat_id'] for seat in seats]

# =============== Fetch Filled Seats for a Bus ===============
def fetch_filled_seats(bus_id):
    query = "SELECT seat_id FROM seats WHERE bus_id = %s AND status = 'filled'"
    seats = _fetch_all(query, (bus_id,))
    return [seat['seat_id'] for seat in seats]

# =============== Helper For allocate_seat ===============
def convert_seat_id_to_number(seat_id):
    row = int(seat_id[:-1])
    letter = seat_id[-1].upper()
    letter_num = ord(letter) - ord('A') + 1
    return row * 10 + letter_num

# =============== Allocate Seat ===============
def allocate_seat(student_id, location):
    retries = 3
    delay = 2  # seconds

    for attempt in range(retries):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT student_id FROM bookings")
            existing_bookings = cursor.fetchall()
            booking_map = {b['student_id']: True for b in existing_bookings}

            if student_id in booking_map:
                return {"status": "error", "message": "Student already has a booking."}

            cursor.execute("""
                SELECT bus_id, seat_id
                FROM seats
                WHERE location = %s AND status = 'available'
                ORDER BY bus_id, seat_id
            """, (location,))
            seats = cursor.fetchall()

            if not seats:
                return {"status": "error", "message": "No available seats in your location"}

            heap = []
            for seat in seats:
                numeric_key = convert_seat_id_to_number(seat['seat_id'])
                heapq.heappush(heap, (numeric_key, seat['bus_id'], seat['seat_id']))

            while heap:
                _, bus_id, seat_id = heapq.heappop(heap)

                cursor.execute("""
                    UPDATE seats
                    SET status = 'filled'
                    WHERE bus_id = %s AND seat_id = %s AND status = 'available'
                """, (bus_id, seat_id))

                if cursor.rowcount == 0:
                    continue

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

            if attempt < retries - 1:
                time.sleep(delay)
                continue

            return {"status": "error", "message": "Seat booking conflict. Please try again."}

        except pymysql.MySQLError as e:
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
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO students (student_id, name, password) VALUES (%s, %s, %s)",
                       (student_id, name, password))
        conn.commit()
        return {"status": "success", "message": f"Student {name} registered successfully"}
    except pymysql.err.IntegrityError as err:
        return {"status": "error", "message": "Student ID already registered"}
    except pymysql.MySQLError as err:
        return {"status": "error", "message": str(err)}
    finally:
        if cursor:
            cursor.close()
        conn.close()

# =============== Login Student ===============
def login_student(student_id, password):
    query = "SELECT * FROM students WHERE student_id = %s AND password = %s"
    results = _fetch_all(query, (student_id, password))
    if results:
        return {"status": "success", "message": f"Student {student_id} logged in successfully"}
    else:
        return {"status": "error", "message": "Invalid student ID or password"}

# =============== Admin Functions ===============
def get_admin_stats():
    conn = get_db_connection()
    if not conn:
        return {"status": "error", "message": "Database connection error"}
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) AS total_buses FROM buses")
        total_buses = cursor.fetchone()['total_buses']

        cursor.execute("SELECT COUNT(*) AS total_bookings FROM bookings")
        total_bookings = cursor.fetchone()['total_bookings']

        cursor.execute("SELECT COUNT(*) AS total_students FROM students")
        total_students = cursor.fetchone()['total_students']

        return {
            "total_buses": total_buses,
            "total_bookings": total_bookings,
            "total_students": total_students
        }
    except pymysql.MySQLError as e:
        return {"status": "error", "message": str(e)}
    finally:
        if cursor:
            cursor.close()
        conn.close()

def fetch_all_buses():
    query = "SELECT * FROM buses"
    return _fetch_all(query)

def fetch_all_bookings():
    query = "SELECT * FROM bookings"
    return _fetch_all(query)

def fetch_all_seats():
    query = "SELECT * FROM seats"
    return _fetch_all(query)

def delete_booking(seat_id, bus_id, location):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return {'status': 'error', 'message': 'Database connection error'}
        cursor = conn.cursor()

        # Delete the booking
        cursor.execute(
            "DELETE FROM bookings WHERE seat_id = %s AND bus_id = %s AND location = %s",
            (seat_id, bus_id, location)
        )
        
        if cursor.rowcount == 0:
            return {'status': 'error', 'message': 'No booking found to remove'}

        # Update the seat status to 'available' after deleting booking
        cursor.execute(
            "UPDATE seats SET status = 'available' WHERE seat_id = %s AND bus_id = %s AND location = %s",
            (seat_id, bus_id, location)
        )
        
        conn.commit()
        
        return {'status': 'success', 'message': 'Booking removed and seat status updated successfully'}

    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def add_bus(bus_id, location):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return {'status': 'error', 'message': 'Database connection error'}
        cursor = conn.cursor()
        cursor.execute("INSERT INTO buses (bus_id, location) VALUES (%s, %s)", (bus_id, location))

        seats = [(f'{row}{col}', bus_id, location, 'available')
                 for row in range(1, 3) for col in ['A', 'B', 'C', 'D', 'E']]

        cursor.executemany("INSERT INTO seats (seat_id, bus_id, location, status) VALUES (%s, %s, %s, %s)", seats)
        conn.commit()
        return {'status': 'success', 'message': 'Bus and seats added successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def remove_bus(bus_id):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return {'status': 'error', 'message': 'Database connection error'}
        cursor = conn.cursor()
        cursor.execute("DELETE FROM bookings WHERE bus_id = %s", (bus_id,))
        cursor.execute("DELETE FROM seats WHERE bus_id = %s", (bus_id,))
        cursor.execute("DELETE FROM buses WHERE bus_id = %s", (bus_id,))
        conn.commit()
        return {'status': 'success', 'message': 'Bus and related data removed successfully'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()