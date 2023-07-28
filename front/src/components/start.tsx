import { useState } from "react";
import SendMessage from "./SendMessage";
import './SendMessage.css'

const Start = () => {
  const [phone, setPhone] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const storenumber = () => {
    // Storing the values in the session manager
    sessionStorage.setItem("phone", phone);
    sessionStorage.setItem("shortCode", shortCode);
    sessionStorage.setItem("dateReceived", dateReceived);

    // Set the submitted flag to true
    setSubmitted(true);
  };

  return (
    <>
     <form onSubmit={storenumber}className="chat-input-container">
        {/* Form inputs */}
        <label htmlFor="phoneInput">Enter Phone Number:</label>
        <input
          id="phoneInput"
          name="phoneInput"
          type="text"
          className="form-input__input"
          placeholder="Phone number..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

       

        <button type="submit">Send</button>
      </form>

      {submitted && <SendMessage />}
    </>
  );
};

export default Start;
