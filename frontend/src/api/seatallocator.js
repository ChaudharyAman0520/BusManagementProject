const API_BASE_URL = 'http://127.0.0.1:5000';

export async function allocateSeat(student_id, bus_id, preferred_seat) {
  try {
    const response = await fetch(`${API_BASE_URL}/allocate-seat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id,
        bus_id,
        preferred_seat
      })
    });

    // Check if the response is not OK (status code outside the range 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to allocate seat');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error allocating seat:', error);
    return { status: 'error', message: error.message };
  }
}