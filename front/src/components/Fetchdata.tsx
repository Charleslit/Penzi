import { useState, useEffect } from "react";
interface ProfileData {
  id: number;
  name: string;
  age: number;
  phone: string;
  gender: string;
  county: string;
  town: string;
  dateCreated: string;
}
function isErrorObject(error: unknown): error is Error {
  return error instanceof Error;
}

function setDataInLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

const Fetchdata = () => {
  const [profileData, setProfileData] = useState<ProfileData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Define expected properties
  const expectedProperties = ['name', 'age'];

  useEffect(() => {
    const fetchProfileData = async () => {
      console.log("fetching data")
      try {
        const payload = {
          msisdn: sessionStorage.getItem("phone"),
          shortCode: 42121,
          dateReceived: new Date(),
        };
        const response = await fetch("http://charleslit.uk.to:5000/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        setDataInLocalStorage("Data", data);
        setProfileData(data);
        setIsLoading(false);
      } 
      catch (error) {
        if (isErrorObject(error)) {
          console.error("Error fetching profile data:", error);
          setError(error.message);
        } else {
          console.error("Unknown error occurred:", error);
          setError("An unknown error occurred.");
        }
        setIsLoading(false);
    
      }
    };

    fetchProfileData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Check if profileData has expected properties for each object
  const isValidData = profileData.length > 0 && profileData.every(user => expectedProperties.every(prop => Object.prototype.hasOwnProperty.call(user, prop)));

  if (!isValidData) {
    return <p>Error: Invalid data format</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Phone</th>
          <th>Gender</th>
          <th>County</th>
          <th>Town</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody>
        {profileData.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.phone}</td>
            <td>{user.gender}</td>
            <td>{user.county}</td>
            <td>{user.town}</td>
            <td>{user.dateCreated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Fetchdata;