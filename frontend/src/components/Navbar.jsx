import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  LogOut,
  User,
  Leaf,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Magnetic from "./common/Magnetic";

import "../styles/navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenu(false);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
    navigate("/");
  };

  const navItems = [
    { title: "Home", path: "/" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "Report", path: "/report" },
    { title: "Assistant", path: "/assistant" },
    { title: "About", path: "/about" },
  ];

  return (
    <header
      className={`navbar-wrapper ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <nav className="navbar">

        {/* Logo */}

        <Link
          to="/"
          className="logo"
        >
          <motion.div
            className="logo-icon"
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Leaf size={20} />
          </motion.div>

          <div className="logo-text">
            <span className="logo-title">
              CivicClean
            </span>

            <span className="logo-subtitle">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop */}

        <ul className="nav-links ce-vine-nav">

          {navItems.map((item) => (

            <li key={item.title}>

              <NavLink
                to={item.path}
                className="ce-vine-link"
              >
                {item.title}
              </NavLink>

            </li>

          ))}

        </ul>

        {/* Desktop Buttons */}

        <div className="nav-actions">

          {user ? (
            <>
              <span className="nav-user">
                <User size={16} />
                {user.name}
              </span>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </>
          )}

          <Magnetic
            as={Link}
            to="/report"
            className="report-btn"
          >
            Report Now

            <ArrowRight size={18} />

          </Magnetic>

        </div>

        {/* Mobile */}

        <button
          className="menu-button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
        >
          {mobileMenu ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>

      </nav>

      {/* Mobile Dropdown */}

      <div
        className={`mobile-menu ${
          mobileMenu ? "show" : ""
        }`}
      >

        {navItems.map((item) => (

          <NavLink
            key={item.title}
            to={item.path}
            onClick={closeMenu}
          >
            {item.title}
          </NavLink>

        ))}

        <div className="mobile-actions">

          {user ? (
            <>
              <span className="nav-user">
                <User size={16} />
                {user.name}
              </span>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}

          <Link
            to="/report"
            className="mobile-report"
            onClick={closeMenu}
          >
            <Leaf size={16} /> Report Issue
          </Link>

        </div>

      </div>

    </header>
  );
}

export default Navbar;

              
