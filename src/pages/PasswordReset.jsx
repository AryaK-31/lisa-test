import { useState } from "react";
import axios from "axios";
import styles from "./PasswordReset.module.css";
import api from "../api";

export default function PasswordReset() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: normalize API payload (success or error) to a string
  function getApiText(payload, fallback = "") {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    if (typeof payload === "object") {
      // common REST fields
      return payload.message || payload.error || payload.detail || fallback;
    }
    return String(payload);
  }

  // Step 1: send OTP to email
  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post(
        "/auth/password/forgot",
        { email }
      );
      setMessage(getApiText(data, "OTP sent to your email."));
      setStep(2);
    } catch (err) {
      setMessage(
        getApiText(err.response?.data, "❌ Error sending OTP. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  // Step 2: verify OTP
  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post(
        "/auth/password/verify-otp",
        { email, otp }
      );
      setMessage(getApiText(data, "OTP verified."));
      setStep(3);
    } catch (err) {
      // setMessage(
      //   getApiText(err.response?.data, "❌ Invalid OTP. Please check and try again.")
      // );
      alert("You are not authorized,Please contact to Admin");
    } finally {
      setLoading(false);
    }
  }

  // Step 3: reset password (same endpoint for all users)
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
      const payload = { email, newPassword, confirmPassword, otp: otp || null };
      // Using the same reset endpoint for everyone
      const { data } = await api.post(
        "/auth/password/reset",
        payload
      );
      setMessage(getApiText(data, "✅ Password updated."));
      setStep(4);
    } catch (err) {
      setMessage(
        getApiText(err.response?.data, "❌ Error resetting password. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Password Reset</h2>

        {/* Step 1: Send OTP */}
        {step === 1 && (
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

        {/* Step 2: Verify OTP */}
        {step === 2 && (
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

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleReset} className={styles.form}>
            <p className={styles.info}>
              Email: <b>{email}</b>
            </p>

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
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Done */}
        {step === 4 && <p className={styles.success}>✅ Password reset successful!</p>}

        {/* Message */}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
