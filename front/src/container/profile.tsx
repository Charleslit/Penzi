import { useState, useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import "./profile.css"

interface User {
  name: string;
  age: number;
  county: string;
  gender: string;
}

interface Props {
  heading: string;
}

interface ProfileProps {
  users: User[];
  selectedUser: User | null;
  handleUserClick: (user: User) => void;
}

function useLocalStorageData(): User[] {
  const data = localStorage.getItem("Data");
  try {
    const parsedData = JSON.parse(data || "[]");
    if (parsedData && parsedData.error && parsedData.error.includes("MySQL Connection not available")) {
      console.error("Error fetching data from MySQL: ", parsedData.error);
      throw new Error("Error fetching data from MySQL");
    }
    return parsedData;
  } catch (error) {
    console.error("Error parsing data from local storage", error);
    throw new Error("Error parsing data from local storage");
  }
}

function ProfileList({ users, selectedUser, handleUserClick }: ProfileProps) {
  if (users.length === 0) {
    return <p>No data found</p>;
  }

  return (
    <ul className="list-group">
      {users.map((user, index) => (
        <li
          className={`list-group-item user-item ${selectedUser === user ? "active" : ""}`}
          key={index}
          onClick={() => handleUserClick(user)}
          role="button"
          aria-label={`Select user ${user.name}`}
        >
          <h5 className="mt-0">{user.name}</h5>
          <p>{user.county}</p>
          <p>{user.gender}</p>
        </li>
      ))}
    </ul>
  );
}

function Profile({ heading }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const data = useLocalStorageData();
    setUsers(data);
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
  };

  return (
    <>
    <div className="profile-container">
      <div className="profile-image-container">
        <div className="profile-image" />
      </div>
      <div className="profile-content">
        <h1>{heading}</h1>
       
      </div>
    </div>
    <ErrorBoundary fallback={<p>Something went wrong.</p>}>
          {selectedUser ? (
            <div className="selected-user-container">
              <button onClick={handleClearSelection} aria-label="Clear selection">
                <h2>{selectedUser.name}</h2>
                <p>Age: {selectedUser.age}</p>
                <p>County: {selectedUser.county}</p>
                <p>gender:{selectedUser.gender}</p>
              </button>
            </div>
          ) : (
            <ProfileList users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} />
          )}
        </ErrorBoundary>
    </>
  );
}

export default Profile;