import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const secretKey = 'lit123';
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Define useNavigate hook

  useEffect(() => {
    // Make a login request to get the token
    const login = async () => {
      try {
        const response = await fetch('http://localhost:5000/Adminlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
              Authorization: `Bearer ${secretKey}`,
            
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Login successful");
          setToken(data.token);
          redirectAdminToHomePage();
        } else {
          console.log("Login failed. Please try again.");
          console.log(response);
          // Handle error case (display error message, etc.)
        }
      } catch (error) {
        console.error(error);
        // Handle error case (display error message, etc.)
      }
    };

    login();
  }, [username, password]); // Run the effect whenever username or password changes

  const setToken = (token: string) => {
    // Implement the logic to set the token in your app's state or storage
    // For example, you can use localStorage to store the token:
    localStorage.setItem('token', token);
  };

  const redirectAdminToHomePage = () => {
    navigate('/Monitor'); // Redirect to the desired route
  };

  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // The login request will be handled by the useEffect hook
  };

  const LoginForm = () => {
    return (
      <div>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          {/* Username and Password input fields */}
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

  return <LoginForm />;
};

export default AdminLogin;