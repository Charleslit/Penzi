import React, { useEffect, useState } from 'react';

function Admin() {
  const [userData, setUserData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Make a login request to get the token
    const login = async () => {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'your-username',
            password: 'your-password',
          }),
        });

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error(error);
      }
    };

    login();
  }, []);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/userdata', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch admin data
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchUserData();
      fetchAdminData();
    }
  }, [token]);

  return (
    <div>
      <h2>User Data:</h2>
      {userData && <p>{userData.message}</p>}

      <h2>Admin Data:</h2>
      {adminData && <p>{adminData.message}</p>}
    </div>
  );
}

export default Admin;