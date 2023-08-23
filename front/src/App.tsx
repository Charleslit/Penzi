import ChatBox from "./components/Chatbox";
import Start from "./components/start";
import NavBar from "./components/Navbar";
import AdminLogin from "./components/AdminLogin.tsx"; // Import the AdminLogin component
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterUser from "./components/RegisterUser"
import Login from "./components/Login.tsx";
import Monitor from "../Monitor/index.tsx"
function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const phone = sessionStorage.getItem("phone");
    if (phone) {
      setUser(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={user ? <ChatBox /> : <Start />} />
          <Route path="/Admin" element={<AdminLogin />} /> {/* Render the AdminLogin component for the /Admin route */}
          <Route path="/Register" element={<RegisterUser />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Monitor" element={<Monitor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
        
    