import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function NavBar() {
    return (
        <div className="nav">

            <Link to="/" className="logo">
                <div className="logo-icon">
                    <Zap size={18} strokeWidth={2.5} />
                </div>

                <span>PortfolioGenie</span>
            </Link>

            <div className="nav-items">
                <Link to="/">Home</Link>
                <Link to="/builder">Builder</Link>
                <Link to="/signin" className="nav-signin">Sign In</Link>
            </div>

        </div>
    );
}