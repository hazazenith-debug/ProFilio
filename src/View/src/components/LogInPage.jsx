import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Zap } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Client-side validations
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim().toLowerCase())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitError("");
    setSubmitting(true);

    try {
      const success = await signin(email.trim(), password);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setSubmitError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-signin">
      {submitError && (
        <div style={{ color: "#ef4444", background: "#fef2f2", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px", border: "1px solid #fee2e2" }}>
          {submitError}
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
        />
        {errors.email && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.email}</span>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
        />
        {errors.password && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.password}</span>}

        <button className="login-submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Client-side validations
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim().toLowerCase())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitError("");
    setSubmitting(true);

    try {
      const success = await signup(name.trim(), email.trim(), password);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setSubmitError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-signup">
      {submitError && (
        <div style={{ color: "#ef4444", background: "#fef2f2", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px", border: "1px solid #fee2e2" }}>
          {submitError}
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
        />
        {errors.name && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.name}</span>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
        />
        {errors.email && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.email}</span>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
        />
        {errors.password && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.password}</span>}

        <button className="login-submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export function LogInPage() {
  const [login, setLogin] = useState(true);

  return (
    <div className="loginContainer">
      <div className="login-header">
        <div className="login-logo">
          <Zap size={28} strokeWidth={2.6} color="white" fill="none" />
        </div>

        <div className="login-title">
          <h4>PortfolioGenie</h4>
          <p style={{ display: "flex", justifyContent: "center", width: "100%", textAlign: "center" }}>
            {login ? "Welcome back" : "Get started for free"}
          </p>
        </div>
      </div>

      <div className="login-body">
        <div className="login-tabs">
          <span
            onClick={() => setLogin(true)}
            className={`login-tab ${login ? "active" : ""}`}
          >
            Sign In
          </span>

          <span
            onClick={() => setLogin(false)}
            className={`login-tab ${!login ? "active" : ""}`}
          >
            Sign Up
          </span>
        </div>

        {login ? <SignIn /> : <SignUp />}

        <div className="login-footer">
          {login ? (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setLogin(false)}>Sign up</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setLogin(true)}>Sign in</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}