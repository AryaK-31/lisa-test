import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";   // auth.js मधून token check करणार

export default function PrivateRoute({ children }) {
  const token = getAuth();   // token मिळवतो

  // जर token नाही तर login page वर redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // token असेल तर requested page दाखव
  return children;
}
