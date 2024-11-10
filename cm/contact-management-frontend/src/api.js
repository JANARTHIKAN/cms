// src/api.js
export const login = async (credentials) => {
  if (credentials.email === 'test@example.com' && credentials.password === 'password') {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Invalid credentials')), 1000);
    });
  }
};
