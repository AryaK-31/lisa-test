import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="screen">
      <div className="card">
        <h2>Unauthorized</h2>
        <p>You don't have permission to view this page.</p>
        <Link to="/login" className="link">Back to Login</Link>
      </div>
    </div>
  );
}
