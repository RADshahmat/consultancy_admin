import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome , FaCalendarCheck, FaBullhorn, FaMoneyBillWave, FaUserShield, FaBox,FaTachometerAlt } from 'react-icons/fa';
import "../Styles/sidebar.css"; 

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="menu">
                <Link to="/dashboard" className="menu-item">
                    <FaTachometerAlt className="menu-icon" /> 
                    <span>Dashboard</span>
                </Link>
                <Link to="/dashboard/appointment" className="menu-item">
                    <FaCalendarCheck className="menu-icon" /> 
                    <span>Appointment</span>
                </Link>
                <Link to="/dashboard/promotion" className="menu-item">
                    <FaBullhorn className="menu-icon" /> 
                    <span>Promotion</span>
                </Link>
                <Link to="/dashboard/payment" className="menu-item">
                    <FaMoneyBillWave className="menu-icon" /> 
                    <span>Payment</span>
                </Link>
                <Link to="/dashboard/permission" className="menu-item">
                    <FaUserShield className="menu-icon" /> 
                    <span>Permissions</span>
                </Link>
                <Link to="/dashboard/package" className="menu-item">
                    <FaBox className="menu-icon" /> 
                    <span>Packages</span>
                </Link>
            </div>
            <Link to="/dashboard/cngpassword" className={`sidebar_footer ${location.pathname === '/cngpassword' ? 'active' : ''}`}>
                <button className="sidebar-change-password-button">Change Password</button>
            </Link>
        </div>
    );
};

export default Sidebar;
