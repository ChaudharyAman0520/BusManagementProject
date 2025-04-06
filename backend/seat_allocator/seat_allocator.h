#ifndef SEAT_ALLOCATOR_H
#define SEAT_ALLOCATOR_H

#include<vector>
#include<unordered_map> 
#include<string>

using namespace std;
class SeatAllocator {
public:

    SeatAllocator(int busId, int totalSeats);

    string bookSeat(int studentId);

    string cancelSeat(int studentId);

    string getSeatMap() const;
private:
    int busId;
    int totalSeats;
    vector<bool> seats;                 // true if seat is booked, false if free.
    unordered_map<int, int> bookings;   // maps student id to seat index.
};
#endif