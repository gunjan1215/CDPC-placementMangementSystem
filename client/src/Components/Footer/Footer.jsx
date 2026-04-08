import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear(); // Automatically shows 2026

  return (
    <div>
      <footer className="bg-dark text-light py-5">
        <div className="container">
          <div className="row gap-3">
            <div className="col-md-3">
              <span className="fw-bold fs-4">SPMS Portal</span>
            </div>
            <div className="col-md-9">
              <ul className="list-unstyled d-flex justify-content-center justify-content-md-start mb-0">
                <li className="me-4">
                  <a href="#home" className="text-white text-decoration-none">Home</a>
                </li>
                <li className="me-4">
                  <a href="#facilities" className="text-white text-decoration-none">Facilities</a>
                </li>
                <li className="me-4">
                  <a href="#recruiters" className="text-white text-decoration-none">Recruiters</a>
                </li>
                <li className="me-4">
                  <a href="#announcements" className="text-white text-decoration-none">Announcements</a>
                </li>
                <li>
                  <a href="#contact" className="text-white text-decoration-none">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* --- COPYRIGHT SECTION --- */}
      <div className="py-3 border-top border-dark bg-dark">
        <div className="container text-center text-white-50">
          <p className="mb-0">
            © {currentYear} <strong>Student Placement Management System</strong>. 
            Designed & Developed with <i className="mdi mdi-heart text-danger" /> by{" "}
            <span className="text-white fw-bold" style={{ textDecoration: 'underline' }}>
              Sakshi Prasad & Gunjan Rathi 
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;