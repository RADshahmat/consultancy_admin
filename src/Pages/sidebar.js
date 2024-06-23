import React from 'react';
import { FaTachometerAlt, FaCalendarCheck, FaBullhorn, FaMoneyBillWave, FaUserShield, FaBox } from 'react-icons/fa';
import "../Styles/admindashboard.css"; // Adjust the path according to your folder structure

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="menu">
                <p className="menu-item"><FaTachometerAlt /> Dashboard</p>
                <p className="menu-item"><FaCalendarCheck /> Appointment</p>
                <p className="menu-item"><FaBullhorn /> Promotion</p>
                <p className="menu-item"><FaMoneyBillWave /> Payment</p>
                <p className="menu-item"><FaUserShield /> Permissions</p>
                <p className="menu-item"><FaBox /> Packages</p>
            </div>
            <div className="footer">
                <button className="change-password-button">Change Password</button>
            </div>

        </div>
    );
};

export default Sidebar;
