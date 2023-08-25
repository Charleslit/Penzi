import { useState, useEffect } from 'react';

interface User {
  id: number; // Assuming 'id' is present in the user data.
  [key: string]: any; // Other properties can have any type.
}

interface DataRowProps {
  data: User;
  townFilter: string;
  columns: string[];
  onClick: () => void;
}

function DataRow({ data, townFilter, columns, onClick }: DataRowProps) {
  if (townFilter && data.town && data.town.toLowerCase() !== townFilter.toLowerCase()) {
    return null;
  }

  return (
    <tr onClick={onClick}>
      {columns.map((column) => (
        <td key={column}>{data[column.toLowerCase()]}</td>
      ))}
    </tr>
  );
}

function FilterableDataTable() {
  const [data, setData] = useState<User[]>([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [townFilter, setTownFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const columns = ['Name', 'Gender', 'Age', 'Town', 'Phone'];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://charleslit.uk.to:5000/users');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: User[] = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const towns = data ? [...new Set(data.map((element) => element?.town))] : [];
  const ages = data ? [...new Set(data.map((element) => element?.age))] : [];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentPage(Number(event.currentTarget.id));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = data.filter((user) =>
    Object.values(user).some(
      (value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
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
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <h1>Filter your Search</h1>
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
              <option value={town} key={town}>
                {town}
              </option>
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
              <option value={age} key={age}>
                {age}
              </option>
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
            id={number.toString()}
            onClick={handlePageChange}
            className={currentPage === number ? 'active' : undefined}
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
