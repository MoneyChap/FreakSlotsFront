import { NavLink } from "react-router-dom";

function IconPhone(props) {
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M8 3.5h8a2 2 0 0 1 2 2V18.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M10 17.5h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconLayers(props) {
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M12 4 3 8.5 12 13l9-4.5L12 4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M3 12.5 12 17l9-4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M3 16.5 12 21l9-4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconUser(props) {
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M4.5 20a7.5 7.5 0 0 1 15 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function BottomNav() {
    return (
        <nav className="bottomNav" role="navigation" aria-label="Primary">
            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    isActive ? "bottomNavItem bottomNavItemActive" : "bottomNavItem"
                }
            >
                <span className="bottomNavIcon">
                    <IconPhone />
                </span>
                <span className="bottomNavLabel">Games</span>
            </NavLink>

            <NavLink
                to="/casinos"
                className={({ isActive }) =>
                    isActive ? "bottomNavItem bottomNavItemActive" : "bottomNavItem"
                }
            >
                <span className="bottomNavIcon">
                    <IconLayers />
                </span>
                <span className="bottomNavLabel">Casinos</span>
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive ? "bottomNavItem bottomNavItemActive" : "bottomNavItem"
                }
            >
                <span className="bottomNavIcon">
                    <IconUser />
                </span>
                <span className="bottomNavLabel">Profile</span>
            </NavLink>
        </nav>
    );
}
