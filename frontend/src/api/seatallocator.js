const API_BASE_URL = 'http://127.0.0.1:5000';

export async function allocateSeat(student_id, bus_id, preferred_seat) {
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

  const data = await response.json();
  return data;
}
