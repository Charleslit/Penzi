
import { useState } from "react";
import FetchData from "../src/components/data/FetchData"
import DashboardCard from './Dashboard'
function Monitor() {
    
        const [showUsers, setShowUsers] = useState(false);
      
        const handleCardClick= (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            event.preventDefault();
          setShowUsers(true);
        };
   
  return (
   <>
    <div>index</div>
    <div className="container">
      <h2>Penzi statistics</h2>
      <div className="row">
        <div className="col-md-4">
          <DashboardCard title="Users" 
          value="100" 
          onClick={handleCardClick}
          />
        </div>
        <div className="col-md-4">
          <DashboardCard title="Revenue" value="$10,000" />
        </div>
        <div className="col-md-4">
          <DashboardCard title="Orders" value="50" />
        </div>
      </div>
      {showUsers && <FetchData />}
    </div>
 
  </>
   )
}

export default Monitor