import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../Logo/Logo";

function Navbar() {
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Updated styles to ensure text is BLACK when scrolling
  const linkStyles = {
    fontSize: "18px",
    fontWeight: "bold",
    color: scrolling ? "#000000" : "#000000", // Forced to black as per your preference
    position: "relative",
    cursor: "pointer",
    transition: "color 0.3s ease"
  };

  return (
    <div className={`container-fluid ${scrolling ? "bg-light shadow" : "bg-transparent"}`}>
      <nav className={`navbar navbar-expand-sm ${scrolling ? "bg-light" : "bg-transparent"} navbar-light py-1 py-lg-3 px-0 px-lg-5 fixed-top`}>
        <div>
          <Logo/>
        </div>
        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
          <div className="navbar-nav fw-bold mx-auto py-0 ">
            
            {/* Home Link */}
            <Link to="/" className="nav-item nav-link fw-bold" style={linkStyles}>
              Home
            </Link>

            {/* Section Anchors - Ensure these IDs exist in Home.jsx */}
            <a href="#recruiters" className="nav-item nav-link fw-bold" style={linkStyles}>
              Recruiters
            </a>

            <a href="#facilities" className="nav-item nav-link fw-bold" style={linkStyles}>
              Facilities
            </a>

            <a href="#announcements" className="nav-item nav-link fw-bold" style={linkStyles}>
              Announcements
            </a>

            <Link to="/aboutus" className="nav-item nav-link fw-bold" style={linkStyles}>
              About
            </Link>

            <a href="#contact" className="nav-item nav-link fw-bold" style={linkStyles}>
              Contact
            </a>
          </div>

          <div className="login-buttons">
            <Link to="/signin" className="btn btn-primary px-4 mx-3">
              LogIn
            </Link>
            <Link to="/signup" className="btn btn-primary px-4">
              SignUp
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;