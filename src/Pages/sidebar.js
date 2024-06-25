import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarCheck, FaBullhorn, FaMoneyBillWave, FaUserShield, FaBox } from 'react-icons/fa';
import "../Styles/sidebar.css"; 

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="menu">
                <Link to="/" className="menu-item">
                    <FaTachometerAlt className="menu-icon" /> 
                    <span>Dashboard</span>
                </Link>
                <Link to="/appointment" className="menu-item">
                    <FaCalendarCheck className="menu-icon" /> 
                    <span>Appointment</span>
                </Link>
                <Link to="/promotion" className="menu-item">
                    <FaBullhorn className="menu-icon" /> 
                    <span>Promotion</span>
                </Link>
                <Link to="/payment" className="menu-item">
                    <FaMoneyBillWave className="menu-icon" /> 
                    <span>Payment</span>
                </Link>
                <Link to="/permission" className="menu-item">
                    <FaUserShield className="menu-icon" /> 
                    <span>Permissions</span>
                </Link>
                <Link to="/package" className="menu-item">
                    <FaBox className="menu-icon" /> 
                    <span>Packages</span>
                </Link>
            </div>
            <div className="sidebar_footer">
                <button className="change-password-button">Change Password</button>
            </div>
        </div>
    );
};

export default Sidebar;
