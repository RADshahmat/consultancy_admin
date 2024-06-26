import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome , FaCalendarCheck, FaBullhorn, FaMoneyBillWave, FaUserShield, FaBox } from 'react-icons/fa';
import "../Styles/sidebar.css"; 

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="menu">
                <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <FaHome className="menu-icon" /> 
                    <span>Dashboard</span>
                </Link>
                <Link to="/appointment" className={`menu-item ${location.pathname === '/appointment' ? 'active' : ''}`}>
                    <FaCalendarCheck className="menu-icon" /> 
                    <span>Appointment</span>
                </Link>
                <Link to="/promotion" className={`menu-item ${location.pathname === '/promotion' ? 'active' : ''}`}>
                    <FaBullhorn className="menu-icon" /> 
                    <span>Promotion</span>
                </Link>
                <Link to="/payment" className={`menu-item ${location.pathname === '/payment' ? 'active' : ''}`}>
                    <FaMoneyBillWave className="menu-icon" /> 
                    <span>Payment</span>
                </Link>
                <Link to="/permission" className={`menu-item ${location.pathname === '/permission' ? 'active' : ''}`}>
                    <FaUserShield className="menu-icon" /> 
                    <span>Permissions</span>
                </Link>
                <Link to="/package" className={`menu-item ${location.pathname === '/package' ? 'active' : ''}`}>
                    <FaBox className="menu-icon" /> 
                    <span>Packages</span>
                </Link>
            </div>
            <Link to="/cngpassword" className={`sidebar_footer ${location.pathname === '/cngpassword' ? 'active' : ''}`}>
                <button className="sidebar-change-password-button">Change Password</button>
            </Link>
        </div>
    );
};

export default Sidebar;
