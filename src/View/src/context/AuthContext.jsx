import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear any existing errors
  const clearError = () => setError(null);

  // Check if user is logged in on page load
  useEffect(() => {
    async function checkUserLoggedIn() {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Token is invalid/expired
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        // Do not remove token on network failure, just let it be, but stop loading
      } finally {
        setLoading(false);
      }
    }

    checkUserLoggedIn();
  }, []);

  // Sign Up user
  const signup = async (name, email, password) => {
    clearError();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign In user
  const signin = async (email, password) => {
    clearError();
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Log Out user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    clearError();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        signin,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
