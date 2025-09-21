// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../utils/api.js";
// import styles from "./EditPage.module.css";

// export default function EditUser() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userData = location.state;

//   const [formData, setFormData] = useState({
//     name: "",
//     password: "",
//   });

//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         name: userData.name || "",
//         password: "", // Do not pre-fill password for security
//       });
//     }
//   }, [userData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/admin/update-user/${userData.id}`, formData);
//       alert("User updated successfully!");
//       navigate("/userlist");
//     } catch (error) {
//       console.error("Error updating user:", error);
//       alert("Failed to update user.");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2 className={styles.title}>Edit User</h2>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <div className={styles.formGroup}>
//             <label>Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//                placeholder="Enter Name"
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Email</label>
//             <input
//               type="Email"
//               name="Email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter Email"
//               required
//             />
//           </div>

//           <div className={styles.buttonGroup}>
//             <button type="submit" className={styles.saveBtn}>
//               Update User
//             </button>
//             <button
//               type="button"
//               className={styles.cancelBtn}
//               onClick={() => navigate("/userlist")}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import styles from "./EditPage.module.css";
import api from "../api";

export default function EditPage() {
  const { id } = useParams(); // ✅ Get user ID from the URL
  const location = useLocation(); // ✅ Used to get state passed from UserList
  const navigate = useNavigate();

  const userData = location.state; // ✅ Data passed from UserList when navigating

  // ✅ CHANGED: Added `email` to the state
  // Previously, only `name` and `password` were here.
  const [formData, setFormData] = useState({
    name: "",
    email: "", // <-- Added this
    password: "",
  });

  // ✅ Load initial data when the page loads
  useEffect(() => {
    if (userData) {
      // ✅ If coming directly from UserList, use state data
      setFormData({
        name: userData.name || "",
        email: userData.email || "", // <-- Added to populate email field
         // Password is always empty for security
      });
    } else {
      // ✅ If user refreshed the page, fetch data from backend
      const fetchUser = async () => {
        try {
          const response = await api.get(`/admin/user/${id}`);
          setFormData({
            name: response.data.name || "",
            email: response.data.email || "", // <-- Added this
            password: "",
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          alert("Failed to load user data");
          navigate("/userlist"); // Redirect back if fetch fails
        }
      };
      fetchUser();
    }
  }, [userData, id, navigate]);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const { password, ...payload } = formData;
    
    // Only include password if user typed something
    if (password && password.trim() !== "") {
      payload.password = password;
    }
      console.log(formData)
      await api.put(`/admin/update-user/${id}`, formData);
      alert("User updated successfully!");
      navigate("/userlist"); // Redirect back to user list after save
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit User</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name" // ✅ Must exactly match the state key `name`
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter user name"
              required
            />
          </div>

          {/* ✅ CHANGED: Email Field */}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email" // <-- FIXED: was `Email` before (case-sensitive issue)
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter user email"
              required
            />
          </div>

          

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveBtn}>
              Update User
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/userlist")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
