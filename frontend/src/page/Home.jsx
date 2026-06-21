import react from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Welcome to Internal Ticket System</h1>

        <p>
          Manage employee issues, track tickets, and streamline department
          support efficiently.
        </p>

        <div className="hero-buttons">
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>

          <Link to="/register">
            <button className="btn btn-secondary">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
