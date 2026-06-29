import { Link } from 'react-router-dom'

export function NavBar() {
    return (
        <div className="nav">
            <div className="logo">
                <img className="logo" alt="" />
                <span>PortfolioGenie</span>
            </div>
            <div className="nav-items">
                <Link to="/">Home</Link>
                <Link to="/builder">Builder</Link>
            </div>
        </div>
    )
}
