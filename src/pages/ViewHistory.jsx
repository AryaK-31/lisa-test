import React from "react";
import "./ViewHistory.css"; // Assume some basic styling for modal

const ViewHistory = ({ historyData, loading, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Application Status History</h3>
        <button className="close-btn" onClick={onClose}>X</button>

        {loading ? (
          <p>Loading...</p>
        ) : historyData.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>From Status</th>
                <th>To Status</th>
                <th>Notes</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((h, i) => (
                <tr key={i}>
                  <td>{h.name}</td>
                  <td>{h.fromStatus}</td>
                  <td>{h.toStatus}</td>
                  <td>{h.notes}</td>
                  <td>{h.dateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewHistory;
