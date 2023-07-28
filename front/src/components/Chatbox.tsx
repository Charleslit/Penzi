
// import Message from "./Message";
import SendMessage from "./SendMessage";
import Profile from "../container/profile.tsx"
import Fetchdata from "./Fetchdata"
import ErrorBoundary from "./ErrorBoundary"
import "./SendMessage.css"

const ChatBox = () => {
 
  return (
    <>
 <div className="d-none">
 <ErrorBoundary fallback={<p>Something went wrong with the server please come back after sometime .</p>}>
 <Fetchdata />
    </ErrorBoundary>
 </div>
    <main className="chat-box">
    <div className="chat-container">
      <ErrorBoundary fallback={<p>we have trouble connecting you with our server .please try again</p>}>
      <SendMessage />
      </ErrorBoundary>
       <div className="messages-wrapper">
       <div className="me-3 chat-sidebar">
       <ErrorBoundary fallback={<p>we are having issues in fetching details of your profile .please relaod the page</p>}>
        < Profile heading={""} />
        </ErrorBoundary>
        </div >
      </div>
      
      </div>

    </main>
     </>
  );
};

export default ChatBox;