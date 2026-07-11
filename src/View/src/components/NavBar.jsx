import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
    const { user, logout } = useAuth();

    return (
        <div className="nav">

            <Link to="/" className="logo">
                <div className="logo-icon">
                    <Zap size={18} strokeWidth={2.5} />
                </div>

                <span>PortfolioGenie</span>
            </Link>

            <div className="nav-items" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <Link to="/">Home</Link>
                <Link to="/builder">Builder</Link>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <span className="nav-user-greeting" style={{ color: "#475569", fontSize: "14.5px", fontWeight: 500 }}>
                            Hi, {user.name.split(" ")[0]}
                        </span>
                        <button 
                            onClick={logout} 
                            className="btn-nav-signout"
                            style={{ 
                                background: "#f1f5f9", 
                                color: "#475569",
                                border: "1px solid #e2e8f0", 
                                cursor: "pointer", 
                                fontFamily: "inherit",
                                fontSize: "14px",
                                fontWeight: "600",
                                padding: "8px 16px",
                                borderRadius: "10px",
                                transition: "all 0.2s ease"
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <Link to="/signin" className="nav-signin">Sign In</Link>
                )}
            </div>

        </div>
    );
}