import { useState } from "react";
import "./LoginPage.css"
import { Zap } from "lucide-react";

function SignIn() {
  return (
    <div className="login-signin">
      <form className="login-form" action="">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="Enter your email" />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter your password" />

        <button className="login-submit-btn" type="submit">
          Sign in
        </button>
      </form>

      <div className="login-footer">
        <p>
          Don't have an account?
          <span><a> Sign up</a></span>
        </p>
      </div>
    </div>
  );
}

function SignUp() {
  return (
    <div className="login-signup">
      <form className="login-form" action="">
        <label htmlFor="name">Full Name</label>
        <input type="text" name="name" placeholder="Enter your name" />

        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="Enter your email" />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter your password" />

        <button className="login-submit-btn" type="submit">
          Create Account
        </button>
      </form>

      <div className="login-footer">
        <p>
          Already have an account?
          <span><a>Sign in</a></span>
        </p>
      </div>
    </div>
  );
}

export function LogInPage() {
  const [login, setLogin] = useState(true);

  const handleClick = () => {
    setLogin(!login);
  };

  return (
    <div className="loginContainer">

      <div className="login-header">

        <div className="login-logo">
          <Zap
            size={28}
            strokeWidth={2.6}
            color="white"
            fill="none"
          />
        </div>

        <div className="login-title">
          <h4>PortfolioGenie</h4>
          <p style={{alignItems:'center',justifyContent:'center',marginLeft:40}}>Welcome back</p>
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
      </div>

    </div>
  );
}