import { useState } from 'react';

import FilterableDataTable from './data/FetchData';
import './Navbar.css';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const handleNavToggle = () => setIsNavOpen(!isNavOpen);

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const linkText = event.currentTarget.textContent;
    if (linkText === 'Contacts') {
      setShowStart(true);
    } else {
      setShowStart(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Penzi
          </a>
          <button className="navbar-toggler" type="button" onClick={handleNavToggle}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${isNavOpen ? ' show' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/" onClick={handleHomeClick}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contacts" onClick={handleHomeClick}>
                  Contacts
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/pricing" onClick={handleHomeClick}>
                  Pricing
                </a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Advanced match
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showStart && <FilterableDataTable />}
     
    </>
  );
}

export default Navbar;