import { useRef, useState, useEffect } from "react";
import React from "react";
import "./SendMessage.css";
import Message from "./Message"


const ChatHeader = () => {
  return (
    <div className="chat-header">
    <Message />
    </div>
  );
};

const ChatMessages = ({ smsResponseRef }) => {
  const bottomRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [smsResponseRef]);

  return (
    <div className="chat-messages">
      {smsResponseRef.map((item, index) => (
        <div
          key={index}
          className={
            item.response ? "chat-message chat-message-mine" : "chat-message"
          }
        >
          <p className="message-text">{item.message}</p>
          <br></br>
          {item.response && (
            <p className="message-timestamp">{[item.response]}</p>
          )}
        </div>
      ))}
      <span ref={bottomRef}></span>
    </div>
  );
};


const MessageInput = ({ message, setMessage, sendMessage }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [message]);

  return (
    <form onSubmit={sendMessage} className="chat-input-container">
      <input
        ref={inputRef}
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Type a message"
        tabIndex={0} // allow keyboard focus
      />
      <button
        type="submit"
        aria-label="Send message"
        tabIndex={0} // allow keyboard focus
      >
        <i className="fa fa-paper-plane">send</i>
      </button>
    </form>
  );
};

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const [smsResponseRef, setSmsResponseRef] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!message.trim()) {
      return; // message is empty or only contains whitespace, do not send
    }

    try {
      const payload = {
        message: message,
        msisdn: sessionStorage.getItem("phone"),
        shortCode: 42121,
        dateReceived: new Date(),
      };

      const response = await fetch("http://127.0.0.1:5000/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSmsResponseRef([
          ...smsResponseRef,
          { message: message, response: data },
        ]);
        setError(null);
        setMessage("");
      } else {
        setSmsResponseRef([...smsResponseRef]);
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSmsResponseRef([...smsResponseRef]);
      setError(
        "An error occurred while sending the message. Please try again."
      );
    }
  };

  return (
    <>

    <div className="chat-container">
      {error && <div className="chat-error">{error}</div>}
      <div className="chat-main">
        <ChatHeader />
        <ChatMessages smsResponseRef={smsResponseRef} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
    </>
  );
};

export default SendMessage;
