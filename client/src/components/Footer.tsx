import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="same-line" style={{ gap: "2rem" }}>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}

export default Footer;
