import { useState, useEffect } from 'react';

function DataRow({ data, townFilter, columns }) {
  if (townFilter && data.town && data.town.toLowerCase() !== townFilter.toLowerCase()) {
    return null;
  }

  return (
    <tr>
      {columns.map((column) => (
        <td key={column}>{data[column.toLowerCase()]}</td>
      ))}
    </tr>
  );
}

function FilterableDataTable() {
  const [data, setData] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [townFilter, setTownFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const columns = ['Name', 'Gender', 'Age', 'Town', 'Phone'];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:5000/users');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const towns = data ? [...new Set(data.map((element) => element.town))] : [];
  const ages = data ? [...new Set(data.map((element) => element.age))] : [];

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
 const filteredUsers = data.filter(
  (user) =>
    (user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Town?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Age?.toString().includes(searchTerm))
);
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1;
    }
    return 0;
  });
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h1>Filter your Search </h1>
      <div>
        <label>
          Filter by gender:
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Filter by town:
          <select
            value={townFilter}
            onChange={(e) => setTownFilter(e.target.value)}
          >
            <option value="">All</option>
            {towns.map((town) => (
              <option value={town} key={town}>{town}</option>
            ))}
          </select>
        </label>
        <label>
          Filter by Age:
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="">All</option>
            {ages.map((age) => (
              <option value={age} key={age}>{age}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <label>
          Sort by:
          <select value={sortBy} onChange={handleSortChange}>
            {columns.map((column) => (
              <option value={column} key={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      </div>
      {currentUsers.length > 0 ? (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <DataRow
                key={user.id}
                data={user}
                townFilter={townFilter}
                columns={columns}
                onClick={() => handleUserClick(user)}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
      <div>
        {pageNumbers.map((number) => (
          <button
            key={number}
            id={number}
            onClick={handlePageChange}
            className={currentPage === number ? 'active' : null}
          >
            {number}
          </button>
        ))}
      </div>
      {selectedUser && (
        <div>
          <h2>{selectedUser.Name}</h2>
          <p>
            Gender: {selectedUser.Gender}, Age: {selectedUser.Age}, Town:{' '}
            {selectedUser.Town}, Phone: {selectedUser.Phone}
          </p>
        </div>
      )}
    </div>
  );
}

export default FilterableDataTable;