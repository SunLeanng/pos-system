import { useEffect, useState } from "react";

import {
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import {
  Moon,
  Sun,
} from "lucide-react";


function Navbar({ title = "Dashboard" }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  /* ========================================
     DARK / LIGHT MODE
  ======================================== */

  const [darkMode, setDarkMode] = useState(() => {

    return (
      localStorage.getItem("theme") === "dark"
    );

  });


  useEffect(() => {

    if (darkMode) {

      document.body.classList.add(
        "dark-mode"
      );

    } else {

      document.body.classList.remove(
        "dark-mode"
      );

    }


    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);


  const toggleTheme = () => {

    setDarkMode(
      (previous) => !previous
    );

  };


  return (

    <header className="navbar">


      {/* ==================================
          LEFT SIDE
      ================================== */}

      <div className="navbar-left">

        <h1>
          {title}
        </h1>

        <p>
          Welcome back, {user?.name || "Admin"} 👋
        </p>

      </div>


      {/* ==================================
          RIGHT SIDE
      ================================== */}

      <div className="navbar-right">


        {/* ==================================
            THEME BUTTON
        ================================== */}

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={
            darkMode
              ? "Light Mode"
              : "Night Mode"
          }
        >

          {darkMode ? (

            <Sun size={20} />

          ) : (

            <Moon size={20} />

          )}

        </button>


        {/* ==================================
            NOTIFICATION
        ================================== */}

        <button
          type="button"
          className="notification-btn"
          title="Notifications"
        >

          <FaBell />

          <span className="notification-dot"></span>

        </button>


        {/* ==================================
            USER
        ================================== */}

        <div className="navbar-user">

          <div className="navbar-avatar">

            <FaUserCircle />

          </div>


          <div className="navbar-user-info">

            <strong>
              {user?.name || "Administrator"}
            </strong>

            <span>
              {user?.role || "Admin"}
            </span>

          </div>

        </div>


      </div>


    </header>

  );

}


export default Navbar;