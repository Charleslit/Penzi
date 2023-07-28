import { useState, useEffect } from "react";

interface Props{ 
    heading: string;
}

interface User {
  name: string;
  age: number;
  county: string;
}

function getDataFromLocalStorage(): User[] {
  const data = localStorage.getItem("Data");
  return data ? JSON.parse(data) : [];
}

const Profile = ({ heading }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(5);

  useEffect(() => {
    const data = getDataFromLocalStorage();
    setUsers(data);
  }, []);

  const profileStyles = {
    backgroundColor: '#f7f7f7',
    padding: '20px',
    fontSize: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 2px rgba(0, 0, 0, .2)'
  };

  const imageStyles = {
    width: '100px',
    height: '100px',
    overflow: 'hidden',
    borderRadius: '50%'
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "age") {
      return a.age - b.age;
    } else {
      return a.county.localeCompare(b.county);
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="float-end ml-0" style={imageStyles}>
        <div className="col-md-7" style={profileStyles}>
          <h1>{heading}</h1>
          <div className="form-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              className="form-control"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              className="form-control"
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="county">County</option>
            </select>
          </div>
          {currentUsers.length === 0 && <p>No data found</p>}
          {selectedUser ? (
            <div>
              <button onClick={() => setSelectedUser(null)}>Close</button>
              <h2>{selectedUser.name}</h2>
              <p>Age: {selectedUser.age}</p>
              <p>County: {selectedUser.county}</p>
            </div>
          ) : (
            <>
              <ul className="list-group">
                {currentUsers.map((user, index) => (
                  <li
                    className="list-group-item user-item"
                    key={index}
                    onClick={() => handleUserClick(user)}
                  >
                    <h5 className="mt-0">{user.name}</h5>
                    <p>{user.county}</p>
                  </li>
                ))}
              </ul>
              <nav>
                <ul className="pagination">
                  {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                      <button
                        type="button"
                        className={`page-link currentPage === number ? "active" : ""}`}
                        onClick={() => handlePageChange(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
};