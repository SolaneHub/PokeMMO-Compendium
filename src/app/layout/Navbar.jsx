import "./Navbar.css";

function Navbar({ onLinkClick, currentActive }) {
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

  const handleLinkClick = (e, linkName) => {
    e.preventDefault();
    const formattedName = linkName.replace(/\s+/g, "");
    onLinkClick(formattedName);
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {links.sort().map((linkName) => {
          const formattedId = linkName.replace(/\s+/g, "");

          return (
            <li key={linkName}>
              <a
                href={`?section=${formattedId}`}
                onClick={(e) => handleLinkClick(e, linkName)}
                className={currentActive === formattedId ? "active" : ""}
              >
                {linkName}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;
