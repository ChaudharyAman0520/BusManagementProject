#include "seat_allocator.h"
#include <iostream>
#include <sstream> // for stringstream to build JSON
#include <string>

using namespace std;

SeatAllocator::SeatAllocator(int busId, int totalSeats) 
    : busId(busId), totalSeats(totalSeats), seats(totalSeats, false) 
{
    // Initially, no seats are booked.
}

string SeatAllocator::bookSeat(int studentId) {
    // Check if the student already has a booking.
    if (bookings.find(studentId) != bookings.end()) {
        return "{\"status\":\"error\", \"message\":\"Student already has a booking.\"}";
    }

    // Find the first available seat.
    for (int i = 0; i < totalSeats; i++) {
        if (!seats[i]) {
            seats[i] = true;
            bookings[studentId] = i;

            // Build JSON response.
            stringstream ss;
            ss << "{\"status\":\"success\", \"busId\":" << busId 
               << ", \"seatNumber\":" << i << ", \"message\":\"Seat booked successfully.\"}";
            return ss.str();
        }
    }

    return "{\"status\":\"error\", \"message\":\"No available seats on this bus.\"}";
}

string SeatAllocator::cancelSeat(int studentId) {
    // Check if the student has a booking.
    if (bookings.find(studentId) == bookings.end()) {
        return "{\"status\":\"error\", \"message\":\"No booking found for this student.\"}";
    }

    int seatIndex = bookings[studentId];
    seats[seatIndex] = false;
    bookings.erase(studentId);

    stringstream ss;
    ss << "{\"status\":\"success\", \"busId\":" << busId 
       << ", \"seatNumber\":" << seatIndex << ", \"message\":\"Booking canceled.\"}";
    return ss.str();
}

string SeatAllocator::getSeatMap() const {
    stringstream ss;
    ss << "{\"busId\":" << busId << ", \"seats\":[";
    for (int i = 0; i < totalSeats; i++) {
        ss << (seats[i] ? "\"X\"" : "\"O\"");
        if (i < totalSeats - 1) ss << ",";
    }
    ss << "]}";
    return ss.str();
}
