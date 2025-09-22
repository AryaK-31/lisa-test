import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserList.module.css";
import api from "../api"; // <- ensure your axios instance is exported from ../api

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [activeChecked, setActiveChecked] = useState(true);
  const [inactiveChecked, setInactiveChecked] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // <-- added
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/users");
        // ensure it's an array
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        // fallback to empty array so UI doesn't break
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/update-status/${id}`, {
        active: newStatus === "Active",
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: newStatus === "Active" } : u))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEditUser = (user) => {
    navigate(`/edituser/${user.id}`, { state: user });
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    const matchesStatus =
      (user.active && activeChecked) || (!user.active && inactiveChecked);

    const matchesSearch =
      query === "" ||
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className={styles.userListWrapper}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Admin Portal</h2>

          <div className={styles.actions}>
            <button className={styles.createUserBtn} onClick={() => navigate("/createuser")}>
              + Create User
            </button>

            {/* Filter Dropdown */}
            <div className={styles.filterDropdown}>
              <button
                className={styles.filterButton}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                Filter ⬇
              </button>

              {showFilterDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id="activeUsers"
                      checked={activeChecked}
                      onChange={() => setActiveChecked(!activeChecked)}
                    />
                    <label htmlFor="activeUsers">Active Users</label>
                  </div>

                  <div className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id="inactiveUsers"
                      checked={inactiveChecked}
                      onChange={() => setInactiveChecked(!inactiveChecked)}
                    />
                    <label htmlFor="inactiveUsers">Inactive Users</label>
                  </div>
                </div>
              )}
            </div>

            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p style={{ padding: 20 }}>Loading users...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>*****</td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={user.active ? "Active" : "Inactive"}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td>
                        <button className={styles.editBtn} onClick={() => handleEditUser(user)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.noData}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
