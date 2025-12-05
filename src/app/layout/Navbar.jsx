import "./Navbar.css";

import { NavLink } from "react-router-dom";

function Navbar() {
  const links = [
    "Elite Four",
    "Ho-Oh",
    "Red",
    "Raids",
    "Pokédex",
    "Pickup",
    "Breeding",
    "Editor",
  ];

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {links.sort().map((linkName) => {
          const path = linkName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");

          return (
            <li key={linkName}>
              <NavLink
                to={`/${path}`}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {linkName}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;
