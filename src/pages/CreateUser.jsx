


import React, { useEffect, useState } from "react";
import styles from "./CreateUser.module.css";
import api from "../api";
import { useLocation } from "react-router-dom";


export default function CreateUserForm({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const location = useLocation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {

  }, [location.key]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/admin/create-users", formData);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create user");
      }
      alert("User created successfully!");

    } catch (error) {
      console.error("Error creating user:", error.response?.data || error.message);
      alert("Error creating user");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Create User</h2>
        <form onSubmit={handleSubmit} className={styles.userForm}>
          <label className={styles.label}>
            Name:
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Password:
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <div className={styles.formActions}>
            <button type="submit" className={`${styles.button} ${styles.saveBtn}`}>
              Save
            </button>
            <button
              type="button"
              onClick={onBack}
              className={`${styles.button} ${styles.cancelBtn}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
