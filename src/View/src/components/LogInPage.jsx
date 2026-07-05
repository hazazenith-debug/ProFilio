import { useState } from "react";
function SignIn() {
  return (
    <div className="signin">
      <form action="">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="Enter your email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter your password" />
        <button type="submit">Sign in</button>
      </form>
      <div>
        <p>Don't have an account? <span><a> Sign up</a></span></p>

      </div>
    </div>
  )
}

function SignUp() {
  return (
    <div className="signup">
      <form action="">
        <label htmlFor="name">Full Name</label>
        <input type="text" name="name" placeholder="Enter your name" />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="Enter your email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter your password" />
        <button type="submit">Create Account</button>
      </form>
      <div >
        <p>Already have an account?<span><a>Sign in</a></span></p>

      </div>
    </div>
  )
}

export function LogInPage() {
  const [login, setLogin] = useState(true);
  const handleClick = () => {
    setLogin(!login);
  }
  return (
    <div className="loginContainer">
      <div className="header">
        <div className="logo">
          <img src="" alt="logo" />
        </div>
        <div className="title">
          <h4>PortfolioGenie</h4>
          <p>Welcome back</p>
        </div>
      </div>
      <div className="body">
        <span onClick={handleClick} className="signin">Sign in</span>
        <span onClick={handleClick} className="signup">Sign up</span>
        {login ? <SignIn /> : <SignUp />}
      </div>
    </div>

  );
}
