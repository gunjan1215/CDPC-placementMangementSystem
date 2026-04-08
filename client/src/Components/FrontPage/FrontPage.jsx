import React from "react";
import "./FrontPage.css";
import './TypingAnimation';
import TypingAnimation from "./TypingAnimation";

function FrontPage() {
  return (
    <div>
      {/* 1. Added id="home" to the main section */}
      <section
        id="home"
        className="lg:h-screen py-36 relative flex items-center background-effect overflow-hidden"
        style={{
          height: 660,
          backgroundColor: "#e0f7fa", 
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="container-fluid z-1 py-5">
          <div className="grid grid-cols-1 py-5">
            <p
              className="lg:leading-normal leading-normal mb-0 py-5 text-start px-5 fw-bold"
              style={{
                fontSize: "65px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: "1.5",
                letterSpacing: "-1px",
                color: "#000"
              }}
            >
              Make The Best Move to <br />
              Choose Your{" "}
              <span className="text-warning">
                <TypingAnimation text="Future" />
              </span>
            </p>
            
            <p
              className="text-slate-400 text-lg max-w-xl py-2 ml-0 text-start px-5 fw-bold"
              style={{
                fontSize: "25px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: "1.5", 
                letterSpacing: "-1px",
                opacity: ".7",
                color: "#000"
              }}
            >
              Explore Job Opportunities, Professional Development &amp;
              Career Guidance. <br/>Our placement cell has a proven track record
              of connecting students with outstanding job opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Note: Other sections like Recruiters, Facilities, and Contact 
          should be handled in your Home.js file by wrapping the 
          components in divs with matching IDs. */}
    </div>
  );
}

export default FrontPage;