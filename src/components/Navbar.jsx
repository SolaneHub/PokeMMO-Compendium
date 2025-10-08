
function Navbar({ onLinkClick, currentActive }) {
    const links = [
        "Elite Four",
        "Ho-Oh",
        "Red",
        "Raids",
        "Pokédex",
        "Pickup",
        "Breeding",
        "Editor"
    ];

    const handleLinkClick = (e, linkName) => {
        e.preventDefault();
        const formattedName = linkName.replace(/\s+/g, "");
        onLinkClick(formattedName);
    };

    return (
        <nav className="navbar">
            <ul className="nav-links">
                {links.sort().map((linkName) => (
                    <li key={linkName}>
                        <a
                            href={`#${linkName.toLowerCase().replace(/\s/g, "-")}`}
                            onClick={(e) => handleLinkClick(e, linkName)}
                            className={
                                currentActive === linkName.replace(/\s+/g, "") ? "active" : ""
                            }
                        >
                            {linkName}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;
