import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PasswordReset.module.css";
import api from "../api";

export default function PasswordResetFlow() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");      // always a string
  const [loading, setLoading] = useState(false);

  // Helper: normalize any API payload (success or error) to a string
  function getApiText(payload, fallback = "") {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    if (typeof payload === "object") {
      // common REST fields
      return payload.message || payload.error || fallback;
    }
    return String(payload);
  }

  // If admin, skip OTP flow entirely and show the change password step
  useEffect(() => {
    if (isAdmin) setStep(3);
  }, [isAdmin]);

  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/auth/password/forgot", { email });
      setMessage(getApiText(data, "OTP sent"));
      setStep(2);
    } catch (err) {
      setMessage(getApiText(err.response?.data, "❌ Error sending OTP"));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/auth/password/verify-otp", { email, otp });
      setMessage(getApiText(data, "OTP verified"));
      setStep(3);
    } catch (err) {
      setMessage(getApiText(err.response?.data, "❌ Invalid OTP"));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("❌ Email is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // For admins: dedicated endpoint that skips OTP (must be authenticated/authorized server-side)
      const url = isAdmin
        ? "/admin/reset-password"
        : "/auth/password/reset";

      const payload = { email, newPassword, confirmPassword };

      const { data } = await axios.post(url, payload);
      setMessage(getApiText(data, "✅ Password updated"));
      setStep(4);
    } catch (err) {
      setMessage(getApiText(err.response?.data, "❌ Error resetting password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isAdmin ? "Admin Password Reset" : "Password Reset"}
        </h2>

        {/* USER FLOW: Step 1 (Send OTP) */}
        {!isAdmin && step === 1 && (
          <form onSubmit={handleForgot} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* USER FLOW: Step 2 (Verify OTP) */}
        {!isAdmin && step === 2 && (
          <form onSubmit={handleVerify} className={styles.form}>
            <p className={styles.info}>
              OTP sent to: <b>{email}</b>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* BOTH (Admin + User): Step 3 (Set New Password) */}
        {step === 3 && (
          <form onSubmit={handleReset} className={styles.form}>
            {isAdmin ? (
              <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            ) : (
              <p className={styles.info}>
                Email: <b>{email}</b>
              </p>
            )}

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Saving..." : isAdmin ? "Change Password" : "Reset Password"}
            </button>
          </form>
        )}

        {/* Done */}
        {step === 4 && (
          <p className={styles.success}>✅ Password reset successful!</p>
        )}

        {/* Message (always string) */}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
