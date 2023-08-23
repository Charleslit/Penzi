import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Define useNavigate hook

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("Login successful");
        redirectToHomePage();
      } else {
        console.log("Login failed. Please try again.");
        console.log(response);
        // Handle error case (display error message, etc.)
      }
    } catch (error) {
      console.log(error);
      // Handle error case (display error message, etc.)
    }
  };

  const redirectToHomePage = () => {
    navigate('/'); // Redirect to the desired route
  };

  const LoginForm = () => {
    const handleSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      handleLogin(event);
    };

    return (
      <div>
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
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