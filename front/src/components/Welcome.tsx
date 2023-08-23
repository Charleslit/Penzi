import Button from "./Button";
import { useEffect } from "react";
import Start from "./start";
import ChatBox from "./Chatbox";

interface WelcomeProps {
  setUser: (value: boolean) => void;
}
let storedPhone = sessionStorage.getItem("phone");
const Welcome = ({ setUser }: WelcomeProps) => {
  useEffect(() => {
    try {
      
      if (storedPhone === null) {
        setUser(false);
      }
    } catch (error) {
      console.log(error); // Handle the error gracefully (e.g., logging, fallback behavior)
    }
  }, []);

  return (
    <main className="welcome">
      <h2>Welcome to Penzi Chat.</h2>
      <p>Start chatting with your ....</p>
      {storedPhone ? (
        <ChatBox />
      ) : (
        <Button color="primary" onClick={() => setUser(true)}>
          Start
        </Button>
      )}
      {!storedPhone && <Start />}
    </main>
  );
};

export default Welcome;
