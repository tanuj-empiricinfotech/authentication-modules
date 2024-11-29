export async function checkEmailExists(email){
  try {
    const response = await fetch('/api/user/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check email');
    }

    return data.exists;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw new Error('Failed to check email');
  }
}
