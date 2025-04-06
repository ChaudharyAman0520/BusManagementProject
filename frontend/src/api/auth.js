export const loginStudent = async (studentId, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, password }),
      });
      return await response.json();
    } catch (error) {
      return { message: 'Failed to connect to server.' };
    }
  };
  