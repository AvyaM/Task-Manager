import React, { useState } from 'react';
import { FaHome, FaCheckCircle } from 'react-icons/fa';
import { IoMdMenu } from "react-icons/io";
import { MdTimer } from "react-icons/md";
import { Link } from 'react-router-dom';
import './NavBar.css';  // Import the updated CSS file

function NavBar({ onAddTask }) {
  const [activeItem, setActiveItem] = useState('home');
  const [isOpen, setIsOpen] = useState(false);  // Toggle menu state

  const handleClick = (item) => {
    setActiveItem(item);
    if (item === 'add task') {
      onAddTask();
    }
  };

  return (
    <div className={`navbar ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Always Visible Menu Button */}
      <div className="menu-button" onClick={() => setIsOpen(!isOpen)}>
        <IoMdMenu className="navbar-icon" />
      </div>

      {/* Sidebar Links */}
      <div className={`navbar-links ${isOpen ? 'show' : 'hide'}`}>
        <Link
          to="/"
          className={`navbar-item ${activeItem === 'home' ? 'active' : ''}`}
          onClick={() => handleClick('home')}
        >
          <FaHome className="navbar-link-icon" />
          <span>Home</span>
        </Link>

        <Link
          to="/completed"
          className={`navbar-item ${activeItem === 'completed' ? 'active' : ''}`}
          onClick={() => handleClick('completed')}
        >
          <FaCheckCircle className="navbar-link-icon" />
          <span>Completed</span>
        </Link>

        <Link
          to="/overDue"
          className={`navbar-item ${activeItem === 'overDue' ? 'active' : ''}`}
          onClick={() => handleClick('overDue')}
        >
          <MdTimer className="navbar-link-icon" />
          <span>Over Due</span>
        </Link>

        {/* <div
          className={`navbar-item ${activeItem === 'add task' ? 'active' : ''}`}
          onClick={() => handleClick('add task')}
        >
          <IoAddCircleOutline className="navbar-link-icon" />
          <span>Add Task</span>
        </div> */}
      </div>
    </div>
  );
}

export default NavBar;
