import {
  Link,
  useLocation
} from "react-router-dom";

import {
  MdDashboard,
  MdCategory,
} from "react-icons/md";

import {
  FaBoxOpen,
  FaShoppingCart,
  FaHistory,
  FaUsers,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";


function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {

  const location = useLocation();


  /* ========================================
     USER
  ======================================== */

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const role = user?.role;


  /* ========================================
     LOGOUT
  ======================================== */

  const logout = () => {

    localStorage.removeItem("user");

    window.location.href = "/login";

  };


  /* ========================================
     MENU ITEMS
  ======================================== */

  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
      adminOnly: true,
    },

    {
      name: "Products",
      path: "/products",
      icon: <FaBoxOpen />,
      adminOnly: true,
    },

    {
      name: "Categories",
      path: "/categories",
      icon: <MdCategory />,
      adminOnly: true,
    },

    {
      name: "POS Sales",
      path: "/sales",
      icon: <FaShoppingCart />,
      adminOnly: false,
    },

    {
      name: "Sales History",
      path: "/sales-history",
      icon: <FaHistory />,
      adminOnly: false,
    },

    {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
      adminOnly: true,
    },

  ];


  /* ========================================
     CLOSE SIDEBAR ON MOBILE
  ======================================== */

  const handleMenuClick = () => {

    if (window.innerWidth <= 768) {

      setSidebarOpen(false);

    }

  };


  return (

    <aside
      className={`sidebar ${
        sidebarOpen
          ? "sidebar-open"
          : ""
      }`}
    >


      {/* ==================================
          MOBILE CLOSE BUTTON
      ================================== */}

      <button
        className="sidebar-close"
        onClick={() =>
          setSidebarOpen(false)
        }
        aria-label="Close menu"
      >

        <FaTimes />

      </button>


      {/* ==================================
          LOGO
      ================================== */}

      <div className="sidebar-logo">

        <div className="logo-icon">

          POS

        </div>


        <div className="logo-text">

          <h2>
            POS SYSTEM
          </h2>

          <span>
            Management
          </span>

        </div>

      </div>


      {/* ==================================
          SECTION TITLE
      ================================== */}

      <div className="sidebar-section-title">

        MAIN MENU

      </div>


      {/* ==================================
          MENU
      ================================== */}

      <ul className="sidebar-menu">

        {menuItems.map((item) => {


          /* Admin protection */

          if (
            item.adminOnly &&
            role !== "admin"
          ) {

            return null;

          }


          /* Active menu */

          const isActive =
            location.pathname ===
            item.path;


          return (

            <li
              key={item.path}
            >

              <Link
                to={item.path}
                className={
                  isActive
                    ? "active"
                    : ""
                }
                onClick={handleMenuClick}
              >

                <span
                  className="menu-icon"
                >

                  {item.icon}

                </span>


                <span
                  className="menu-text"
                >

                  {item.name}

                </span>

              </Link>

            </li>

          );

        })}

      </ul>


      {/* ==================================
          BOTTOM
      ================================== */}

      <div className="sidebar-bottom">


        {/* USER */}

        <div className="sidebar-user">


          <div className="user-avatar">

            {(user?.name || "A")
              .charAt(0)
              .toUpperCase()}

          </div>


          <div className="user-info">

            <strong>

              {user?.name ||
                "Administrator"}

            </strong>


            <span>

              {user?.email ||
                "admin@gmail.com"}

            </span>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>

  );

}


export default Sidebar;