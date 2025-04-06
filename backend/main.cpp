#include "seat_allocator/seat_allocator.h"
#include <iostream>

using namespace std;

int main() {
    // Create a SeatAllocator for bus 101 with 5 seats.
    SeatAllocator allocator(101, 5);

    cout << allocator.bookSeat(1001) << endl;
    cout << allocator.bookSeat(1002) << endl;
    cout << allocator.getSeatMap() << endl;
    cout << allocator.cancelSeat(1001) << endl;
    cout << allocator.getSeatMap() << endl;
    return 0;
}
