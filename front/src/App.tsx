import ChatBox from "./components/Chatbox";
import Start from "./components/start";
import NavBar from "./components/Navbar";

import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const phone = sessionStorage.getItem("phone");
    if (phone) {
      setUser(true);
    }
  }, []);

  return (
    <div className="App">
      
      <NavBar />
      {user ? <ChatBox /> : <Start  />}
    </div>
  );
}

export default App;