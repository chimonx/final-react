import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './Login.css'; // Import the external CSS file

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    setLoading(true);

    try {
      const response = await fetch('https://login.smobu.cloud/bu_kunkorn.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.status === 'studentOK' || result.status === 'facultyOK') {
        // Show a success alert
        Swal.fire({
          title: 'Login Successful',
          text: `Welcome, ${username}`,
          icon: 'success',
          timer: 3000, // Close after 3 seconds
          timerProgressBar: true, // Show the timer progress bar
          showConfirmButton: false, // Hide the confirm button
        });

        // Save login info to Firestore
        await addDoc(collection(db, 'logins'), {
          username: username,
          loginTime: new Date().toISOString(),
        });

        // Save username to localStorage
        localStorage.setItem('username', username);

        onLoginSuccess(username);
      } else {
        // Show an error alert
        Swal.fire({
          title: 'Login Failed',
          text: result.message,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      // Show an error alert for fetch failure
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during login. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Login by BU Account</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
