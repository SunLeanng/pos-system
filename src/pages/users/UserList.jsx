import { useEffect, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaUserShield,
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../../services/userService";

function UserList() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  /* ========================================
     LOAD USERS
  ======================================== */

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load users");
    }
  };

  /* ========================================
     CHANGE USER ROLE
  ======================================== */

  const changeRole = async (id, role) => {
    try {
      await updateUserRole(id, role);

      toast.success("User role updated");

      await loadUsers();
    } catch (error) {
      console.log(error);

      toast.error("Failed to update role");
    }
  };

  /* ========================================
     DELETE USER
  ======================================== */

  const removeUser = (id) => {
    toast(
      (t) => (
        <div
          style={{
            width: "360px",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "18px",
            boxShadow:
              "0 8px 30px rgba(15, 23, 42, 0.15)",
          }}
        >

          {/* Warning Header */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                }}
              >
                ⚠️
              </span>
            </div>

            <div>

              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                Delete User
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#64748B",
                }}
              >
                This action cannot be undone.
              </p>

            </div>

          </div>


          {/* Message */}

          <p
            style={{
              margin: "0 0 18px",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#475569",
            }}
          >
            Are you sure you want to delete this user?
          </p>


          {/* Buttons */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >

            {/* Cancel */}

            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              style={{
                padding: "9px 16px",
                border: "1px solid #E2E8F0",
                borderRadius: "7px",
                background: "#F8FAFC",
                color: "#475569",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>


            {/* Delete */}

            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  await deleteUser(id);

                  toast.success(
                    "User deleted successfully",
                    {
                      duration: 3000,
                    }
                  );

                  await loadUsers();
                } catch (error) {
                  console.log(error);

                  toast.error(
                    "Failed to delete user"
                  );
                }
              }}
              style={{
                padding: "9px 16px",
                border: "none",
                borderRadius: "7px",
                background: "#DC2626",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

          </div>

        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
        },
      }
    );
  };


  /* ========================================
     FILTER USERS
  ======================================== */

  const filteredUsers = users.filter((user) => {
    const name =
      user.name?.toLowerCase() || "";

    const email =
      user.email?.toLowerCase() || "";

    const searchValue =
      search.toLowerCase();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue)
    );
  });


  return (
    <div className="dashboard-content">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="product-header">

        <div>

          <h1>
            Users Management
          </h1>

          <p className="page-description">
            Manage users and their system roles
          </p>

        </div>

      </div>


      {/* ==================================
          SEARCH
      ================================== */}

      <div className="search-container">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ==================================
          USERS TABLE
      ================================== */}

      <div className="table-container">

        <table className="product-table">

          <thead>

            <tr>

              <th>
                User
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map((user) => (

                <tr
                  key={user.id}
                >

                  {/* User */}

                  <td>

                    <div className="user-table-info">

                      <div
                        className={
                          user.role === "admin"
                            ? "user-avatar admin-avatar"
                            : "user-avatar"
                        }
                      >

                        {user.role === "admin" ? (
                          <FaUserShield />
                        ) : (
                          <FaUser />
                        )}

                      </div>


                      <strong>
                        {user.name || "User"}
                      </strong>

                    </div>

                  </td>


                  {/* Email */}

                  <td>
                    {user.email}
                  </td>


                  {/* Role */}

                  <td>

                    <div className="role-wrapper">

                      <span
                        className={
                          user.role === "admin"
                            ? "role-badge admin-role"
                            : "role-badge staff-role"
                        }
                      >

                        {user.role || "staff"}

                      </span>


                      <select
                        className="role-select"
                        value={
                          user.role || "staff"
                        }
                        onChange={(e) =>
                          changeRole(
                            user.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="admin">
                          Admin
                        </option>

                        <option value="staff">
                          Staff
                        </option>

                      </select>

                    </div>

                  </td>


                  {/* Delete */}

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        removeUser(user.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="empty-table"
                >
                  No users found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default UserList;